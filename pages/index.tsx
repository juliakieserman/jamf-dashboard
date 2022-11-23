import { GridColDef } from '@mui/x-data-grid';
import { getUserAuth  } from './api/auth';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import DeviceDetailed from '../components/DeviceDetailed';
import { Computer, JamfItem, DeviceProps, DeviceRow } from '../types/types';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function isSoftwareUpToDate( latestSoftware: string, deviceSoftware: string) {
    return deviceSoftware >= latestSoftware;
}

function prepareRows( computers: Computer[], softwareUpdates: string[] ) {
    let rows = [];
    for ( const index in computers ) {
        const computer = computers[ index ];
        const softwareStatus = isSoftwareUpToDate( softwareUpdates[0], computer.hardware.os_version );
        let ownership = 'UNKNOWN';
        if ( computer.purchasing.is_leased ) {
            ownership = 'LEASED';
        }
        if ( computer.purchasing.is_purchased ) {
            ownership = 'PURCHASED';
        }

        let isValid = false;
        if ( computer.security.firewall_enabled && softwareStatus && computer.hardware.disk_encryption_configuration !== "" ) {
            isValid = true;
        }

        rows.push(
            {
                id: computer.general.id,
                name: computer.general.name,
                emailAddress: computer.location.email_address,
                ownership,
                osVersion: {
                    label: computer.hardware.os_version,
                    status: softwareStatus ? "success" : "error",
                    version: softwareUpdates[0]
                },
                firewallEnabled: {
                    label: computer.security.firewall_enabled ? "Firewall Enabled" : "NOT ENABLED",
                    status: computer.security.firewall_enabled ? "success" : "error"
                },
                diskEncrypted: {
                    label: computer.hardware.disk_encryption_configuration === "" ? "NOT ENCRYPTED" : "ENCRYPTED",
                    status: computer.hardware.disk_encryption_configuration === "" ? "error" : "success"
                },
                // TODO: logic to parse out the admin account in the case of multiple accounts
                localAccounts: computer.groups_accounts.local_accounts,
                applications: computer.software.applications,
                lastContactTime: computer.general.last_contact_time,
                isValid 
            }
        )
    }
    return rows;
}
  
export default function Device( { computers, softwareUpdates }: DeviceProps ) {
    const rows = prepareRows( computers, softwareUpdates["availableUpdates"] );
    const [ open, setOpen] = useState(false);
    useEffect( () => {}, [open])

    // dialog controls
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    return (
    <Container>
        <h3> Device Details</h3>
        <div className={styles.controls}>
          <Button className={styles.rightBuffer} onClick={handleClickOpen} variant='contained'> Start an email campaign</Button>
          <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Notify Account Admins"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          On clicking send, an email notification will be generated for all selected devices notifying them of required corrective action
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Send</Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
          <Button variant='contained'>
            <Link href='/policies'> Manage policies </Link>
          </Button>
        </div>
        <Grid container spacing={4}>
            {rows.map((computer, index) => (
                <DeviceDetailed key={index} computer={computer} />
            ))}
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
