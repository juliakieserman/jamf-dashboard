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

// generic "items" returned from JAMF API
// examples: computer, policy
export type JamfItem = {
    id: number,
    name: string
}

export type LocalAccount = {
    administrator: boolean,
    filevault_enabled: boolean,
    home: string,
    home_size: string,
    home_size_mb: number,
    name: string,
    realname: string,
    uid: string
}

export type Computer = {
    general: {
        id: number,
        name: string
    },
    hardware: {
        os_version: string,
        disk_encryption_configuration: string
    },
    security: {
        activation_lock: boolean,
        external_boot_level: string,
        firewall_enabled: boolean,
        recovery_lock_enabled: boolean,
        secure_boot_level: string
    },
    groups_accounts: {
        local_accounts: LocalAccount []
    }
}