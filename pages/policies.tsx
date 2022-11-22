import { getUserAuth } from "./api/auth";

import * as React from 'react';
import { 
    Grid,
    Card,
    CardActions,
    CardContent,
    Button,
    Typography,
    Chip
} from '@mui/material';
import useSwr from 'swr';
import { Policy, JamfItem } from "../types/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type PolicyProps = {
    policies: Policy[]
}

export default function Policies( { policies }: PolicyProps ) {
    const { data, error } = useSwr('/api/staticpolicies', fetcher);
    console.log("DATA");
    console.log(data);
    return (
        <div>
            <Grid container spacing={2}>
                { policies.map((policy: Policy, index: number) => {
                    const scope = policy.scope.all_computers ? 'All Computers' : 'Limited Scope';
                    return (
                        <Grid key={index} item xs={3}>
                            <Card>
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
                { data.map((policy: any, index: number) => {
                    return (
                        <Grid key={index} item xs={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        { policy.name }
                                    </Typography>
                                    <Typography variant="body2">
                                        { policy.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Chip color="error" label="Not Enabled"></Chip>
                                    <Button> Enable </Button>
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

