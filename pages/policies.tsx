import { getUserAuth } from "./api/auth";

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export type Policy = {
    general: {
        id: number,
        name: string,
        frequency: string
    },
    scope: {
        all_computers: boolean
    },
    self_service: [Object],
    package_configuration: [Object],
    scripts: [],
    printers: [Array<string>],
    dock_items: [],
    account_maintenance: [Object],
    reboot: [Object],
    maintenance: [Object],
    files_processes: [Object],
    user_interaction: [Object],
    disk_encryption: [Object]
}

type PolicyProps = {
    policies: Policy[]
}

type JamfItem = {
    id: number,
    name: string
}

export default function Policies( { policies }: PolicyProps ) {
    return (
        <div>
        <Grid container spacing={2}>
            {policies
              .map((policy: Policy, index: number) => {
                const scope = policy.scope.all_computers ? 'All Computers' : 'Limited Scope';
                return (
                    <Grid key={index} item xs={8}>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Policy { policy.general.id }
                                </Typography>
                                <Typography variant="h5" component="div">
                                   { policy.general.name }
                                </Typography>
                                <Typography variant="body2">
                                <br />
                                <b>Frequency:</b> { policy.general.frequency }
                                <br />
                                <b>Scope:</b> { scope }
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Chip color="success" label="Enabled"></Chip>
                            </CardActions>
                        </Card>
                    </Grid>
                );
              })}
        </Grid>
        <Button size="large" variant="contained"> Add a policy </Button>
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

