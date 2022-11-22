import { GridColDef } from '@mui/x-data-grid';
import { getUserAuth  } from './api/auth';
import { 
    Chip,
    Checkbox,
    Card,
    CardContent,
    Container,
    Grid,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table
} from '@mui/material';
import { SimpleDialog } from '../components/SimpleDialog';
import { Computer, JamfItem } from '../types/types';
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';


export type DeviceProps = {
    computers: Computer[]
    softwareUpdates: { availableUpdates: string[] }
}

const columns: GridColDef[] = [
    { field: 'select', headerName: 'Select', width: 70 },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'osVersion', headerName: 'OS Version', width: 150 },
    { field: 'firewallEnabled', headerName: 'Firewall', width: 150 },
    { field: 'diskEncrypted', headerName: 'Disk Encryption', width: 150 },
    { field: 'adminAccount', headerName: 'Admin Account', width: 150 }
  ];

function isSoftwareUpToDate( latestSoftware: string, deviceSoftware: string) {
    return deviceSoftware >= latestSoftware;
}

function prepareRows( computers: Computer[], softwareUpdates: string[] ) {
    let rows = [];
    for ( const index in computers ) {
        const computer = computers[ index ];
        const softwareStatus = isSoftwareUpToDate( softwareUpdates[0], computer.hardware.os_version );
        const accounts = computer.groups_accounts.local_accounts;
        rows.push(
            {
                id: computer.general.id,
                name: computer.general.name,
                osVersion: {
                    label: computer.hardware.os_version,
                    status: softwareStatus ? "success" : "error"
                },
                firewallEnabled: {
                    label: computer.security.firewall_enabled ? "ENABLED" : "NOT ENABLED",
                    // TODO: https://mui.com/material-ui/customization/palette/#adding-new-colors
                    status: computer.security.firewall_enabled ? "success" : "error"
                },
                diskEncrypted: {
                    label: computer.hardware.disk_encryption_configuration === "" ? "NOT ENCRYPTED" : "ENCRYPTED",
                    status: computer.hardware.disk_encryption_configuration === "" ? "error" : "success"
                },
                // TODO: logic to parse out the admin account in the case of multiple accounts
                adminAccount: computer.groups_accounts.local_accounts[0].administrator ? computer.groups_accounts.local_accounts[0].realname : 'UNKNOWN',
            }
        )
    }
    return rows;
}
  
export default function Device( { computers, softwareUpdates }: DeviceProps ) {
    const rows = prepareRows( computers, softwareUpdates["availableUpdates"] );
    console.log("COMPUTERS");
    console.log(computers);
    const [ selectedDevices, setSelectedDevices ] = useState<number[]>([]);
    const [ open, setOpen] = useState(false);

    const handleItemClick = ( row: number ) => {
        if (!selectedDevices.includes(row)) {
            setSelectedDevices(selectedDevices => [...selectedDevices, row]);
        } else {
            console.log("right spot?");
            
            setSelectedDevices( selectedDevices.splice( selectedDevices.indexOf(row), 1))
        }
        
    }

    const handleClose = (value: string) => {
        setOpen(false);
      };
      const handleClickOpen = () => {
        setOpen(true);
      };

    useEffect( () => {
        console.log(selectedDevices);
    }, [selectedDevices])

    return (
    <Container>
    <TableContainer>
        <Table>
        <TableHead>
            <TableRow>
                {columns.map((column, index) => (
                    <TableCell key={index}> {column.headerName} </TableCell>
                ))}
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row) => (
                <TableRow key={row.id}>
                    <TableCell>
                        <Checkbox onClick={() => handleItemClick(row.id )}/>
                    </TableCell>
                    <TableCell> {row.id} </TableCell>
                    <TableCell> {row.name} </TableCell>
                    <TableCell>
                        <Chip
                            variant="outlined"
                            color="error"
                            key={row.id}
                            label={row.osVersion.label}
                        />
                    </TableCell>
                    <TableCell>
                        <Chip
                            variant="outlined"
                            color="error"
                            key={row.id}
                            label={row.firewallEnabled.label}
                        />
                    </TableCell>
                    <TableCell>
                        <Chip
                            variant="outlined"
                            color="error"
                            key={row.id}
                            label={row.diskEncrypted.label}
                        />
                    </TableCell>
                    <TableCell> {row.adminAccount} </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
      </TableContainer>
      <br />
      <h3> Device Details</h3>
      <Grid>
        {selectedDevices.map((index) => (
            <Card key={index}>
                <CardContent>
                    { computers[index-1].general.name}
                </CardContent>
            </Card>       
        ))}
        <Button onClick={handleClickOpen}> Email Admin(s)</Button>
        <SimpleDialog
            open={open}
            onClose={handleClose}
      />
      </Grid>
    
      </Container>
    );
}

// fetch device data from JAMF
export async function getStaticProps() {
    const authObject = await getUserAuth();

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
    const deviceDetails = await getDeviceDetails( devices["computers"], authObject.token );
  
    return {
      props: {
        computers: deviceDetails,
        softwareUpdates: softwareUpdates
      }
    }
}

async function getDevices( token: string ) {
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
    return json;
}

async function getDeviceDetails( devices: JamfItem[], token: string ) {
    // TODO: include mobile devices
    const deviceDetails = await Promise.all(
        devices.map( async ( item: JamfItem ) => {
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
            return json["computer"];
        } )
    )
    return deviceDetails;
}
