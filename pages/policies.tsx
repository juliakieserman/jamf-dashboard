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
import { Policy, JamfItem, PolicyProps } from "../types/types";
import Link from 'next/link';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const staticPolicies = [
    {
        name: 'SOC2',
        description: 'AICPA standardized framework to prove a company’s security posture to prospective customers.',
        status: 'Not Enabled'
    },
    {
        name: 'GDPR',
        description: 'European Union (EU) regulation to protect personal data and privacy of its citizens.',
        status: 'Not Enabled'
    },
    {
        name: 'HIPPA',
        description: 'United States (US) regulation to secure Protected Health Information (PHI).',
        status: 'Not Enabled'
    },
    {
        name: 'CCPA',
        description: 'California regulation that gives residents new data privacy rights.',
        status: 'Not Enabled'
    },
    {
        name: 'ISO 27701',
        description: 'ISO 27701 is an extension of ISO 27001 that specifies the requirements for establishing, implementing, maintaining and continually improving a privacy information management system (PIMS).',
        status: 'Not Enabled'
    },
    {
        name: 'ISO 27018',
        description: 'ISO 27018 establishes controls to protect Personally Identifiable Information (PII) in public cloud computing environments.',
        status: 'Not Enabled'
    },
    {
        name: 'Microsoft SSPA',
        description: 'Microsoft SSPA is a mandatory compliance program for Microsoft suppliers working with Personal Data and/or Microsoft Confidential Data.',
        status: 'Not Enabled'
    }
]

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

export default function Policies( { policies }: PolicyProps ) {
    const [ otherPolicies, setOtherPolicies ] = useState(staticPolicies);
    const handleItemClick = ( index: number ) => {
        const newOtherPolicies = otherPolicies.map( (item, i) => {
            const newValue = otherPolicies[ index ].status === "Not Enabled" ? "Enabled" : "Not Enabled";
            if ( i === index ) {
                return {...item, status: newValue}
            }
            return item;
        })
       
        setOtherPolicies(newOtherPolicies);
    };

    const getButtonValue = ( currValue: string ) => {
        if ( currValue === 'Enabled' ) {
            return { value: 'Disable', color: 'success' };
        }
        return { value: 'Enable', color: 'error' };
    }

    useEffect( () => {}, [otherPolicies])

    return (
        <div className={styles.grid}>
            <div className={styles.controls}>
                <Button className={styles.rightBuffer} variant="contained"> Add a policy </Button>
                <Button variant="contained"> 
                    <Link href='/'>
                        View Devices
                    </Link>
                </Button>
            </div>
                { policies.map((policy: Policy, index: number) => {
                    const scope = policy.scope.all_computers ? 'All Computers' : 'Limited Scope';
                    return (
                        <Grid key={index} item xs={4}>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
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
                                    <Button> Disable </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
                { otherPolicies.map((policy: any, index: number) => {
                    return (
                        <Grid key={index} item xs={4}>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        { policy.name }
                                    </Typography>
                                    <Typography variant="body2">
                                        { policy.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    
                                    <Button onClick={() => handleItemClick(index)}> {getButtonValue(policy.status).value} </Button>
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

