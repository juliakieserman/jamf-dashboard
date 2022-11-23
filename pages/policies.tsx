import { getUserAuth } from "./api/auth";
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Policy, JamfItem, PolicyProps, PolicyLite } from "../types/types";
import Link from 'next/link';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { staticPolicies } from "../data/data";

export default function Policies( { policies }: PolicyProps ) {
    const prepareRealData = ( policies: Policy[]) => {
        let allRows = [];
        for (const index in policies) {
            const policy = policies[index];
            const scope = policy.scope.all_computers ? 'All Computers' : 'Limited Scope';
            allRows.push(
                {
                    name: policy.general.name,
                    description: scope,
                    status: policy.general.enabled,
                    type: 'JAMF'
                }
            )
        }
        return allRows;
    }
    
    const data: PolicyLite[] = prepareRealData(policies).concat(staticPolicies);

    const [ selectedPolicies, setSelectedPolicies ] = useState<PolicyLite[]>(data);
    useEffect( () => {}, [selectedPolicies]);
    const [ openDialog, setOpenDialog ] = useState(false);
    useEffect( () => {}, [openDialog])
    
    const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checkValue = event.target.checked;
        if ( checkValue ) {
            const enabledOnlyPolices = data.filter(policy => policy.status);
            setSelectedPolicies(enabledOnlyPolices);
        } else {
            setSelectedPolicies(data);
        }
    };

    function isEnabled(policy: PolicyLite ) {
        if ( policy.status ) {
            return (
                <Chip label="ENABLED" color="success"/>
            )
        }
        return (
            <Chip label="NOT ENABLED" color="error" />
        )
    }
    const getButtonValue = ( currValue: boolean ) => {
        if ( currValue ) {
            return { value: 'Disable', color: 'success' };
        }
        return { value: 'Enable', color: 'error' };
    }

    return (
        <div className={styles.grid}>
            <div className={styles.controls}>
                <Button className={styles.rightBuffer} variant="contained"> Add a policy </Button>
                <Button variant="contained"> 
                    <Link href='/'>
                        View Devices
                    </Link>
                </Button>
                <FormGroup className={styles.controls}>
                    Filter:
                    <FormControlLabel control={<Checkbox onChange={handleFilter}/>} label="Enabled" />
                </FormGroup>
            </div>
                { selectedPolicies.map((policy, index: number) => {
                    return (
                        <Grid key={index} item xs={4}>
                            <Card className={styles.topBufferSmall} sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography variant="h5">
                                        { policy.name }
                                    </Typography>
                                    <Typography className={styles.controls} variant="body1">
                                        <b>{ policy.type }</b>
                                    </Typography>
                                    <Typography variant="body2">
                                        { policy.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <div>
                                        {isEnabled(policy)}
                                        <Button> {getButtonValue(policy.status).value} </Button>
                                    </div>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
        </div>
    )
}

export async function getStaticProps() {
    const authObject = await getUserAuth();
    const policies = await getPolicies( authObject.token );
    const policyDetails = await getPolicyDetails( policies["policies"], authObject.token );

    return {
        props: {
            policies: policyDetails
        }
    }
}

async function getPolicies( token: string ) {
    const fetchPolicies = await fetch(
        `https://ohmnfr.jamfcloud.com${process.env.JAMF_CLASSIC_URI}policies`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            }
        }
    )
    const policies = await fetchPolicies.json();
    return policies;
}


async function getPolicyDetails( policies: JamfItem[], token: string ) {
    const policyDetails = await Promise.all(
        policies.map( async ( item: JamfItem ) => {
            const res = await fetch(
                `https://ohmnfr.jamfcloud.com${process.env.JAMF_CLASSIC_URI}policies/id/${item.id}`,
                {
                    method: "get",
                    headers: {
                      Authorization: 'Bearer ' + token,
                      Accept: 'application/json'
                  } 
                }
            )
            const json = await res.json();
            return json["policy"];
        } )
    )
    return policyDetails;
}

