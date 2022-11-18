

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export type Computer = {
    general: {
        id: number
    }    
}

export default function Device( { computers, softwareUpdates } ) {
    console.log("DATA");
    console.log(computers);
    console.log(softwareUpdates);
    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650 } }>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device Name</TableCell>
                            <TableCell>Device Owner</TableCell>
                            <TableCell>OS Software</TableCell>
                            <TableCell>SOC2 Policy Compliance</TableCell>
                            <TableCell>HIPPA Compliance</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </div>
    )
}


// fetch device data from JAMF
export async function getStaticProps() {
    // fetch bearer token
    const auth = await
    fetch(
      `https://ohmnfr.jamfcloud.com${process.env.JAMF_PRO_URI}auth/token`, {
          method: "POST",
          headers: {
            Authorization: 'Basic ' + Buffer.from( process.env.JAMF_USERNAME + ":" + process.env.JAMF_PASSWORD ).toString( 'base64' )
          }
      }
    );
    const authObject = await auth.json();

    // get latest software version to determine OS up-to-dateness
    const updates = await fetch(
        `https://ohmnfr.jamfcloud.com${process.env.JAMF_PRO_URI}macos-managed-software-updates/available-updates`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + authObject.token,
                Accept: 'application/json'
            }
        }
    )
    const softwareUpdates = await updates.json();

    const devices = await getDevices( authObject.token );
    const deviceDetails = await getDeviceDetails( devices, authObject.token );
  
    return {
      props: {
        computers: deviceDetails,
        softwareUpdates: softwareUpdates
      }
    }
}

export async function getDevices( token: string ) {
     const computers = await fetch(
        `https://ohmnfr.jamfcloud.com${process.env.JAMF_CLASSIC_URI}computers`, {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            }
        }
    )
    const json = await computers.json();
    return Object.entries( json );
}

type Device = {
    id: number,
    name: string
}

export async function getDeviceDetails( devices, token: string ) {
    const deviceDetails = await Promise.all(
        devices[0][1].map( async ( item: Device ) => {
            const res = await fetch(
                `https://ohmnfr.jamfcloud.com${process.env.JAMF_CLASSIC_URI}computers/id/${item.id}`,
                {
                    method: "get",
                    headers: {
                      Authorization: 'Bearer ' + token,
                      Accept: 'application/json'
                  } 
                }
            )
            const json = await res.json();
            return json;
        } )
    )
    return deviceDetails;
}
