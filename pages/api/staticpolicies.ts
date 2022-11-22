const policies = [
    {
        name: 'SOC2',
        description: 'AICPA standardized framework to prove a company’s security posture to prospective customers.'
    },
    {
        name: 'GDPR',
        description: 'European Union (EU) regulation to protect personal data and privacy of its citizens.'
    },
    {
        name: 'HIPPA',
        description: 'United States (US) regulation to secure Protected Health Information (PHI).'
    },
    {
        name: 'CCPA',
        description: 'California regulation that gives residents new data privacy rights.'
    },
    {
        name: 'ISO 27701',
        description: 'ISO 27701 is an extension of ISO 27001 that specifies the requirements for establishing, implementing, maintaining and continually improving a privacy information management system (PIMS).'
    },
    {
        name: 'ISO 27018',
        description: 'ISO 27018 establishes controls to protect Personally Identifiable Information (PII) in public cloud computing environments.'
    },
    {
        name: 'Microsoft SSPA',
        description: 'Microsoft SSPA is a mandatory compliance program for Microsoft suppliers working with Personal Data and/or Microsoft Confidential Data.'
    }
]

export default function handler(req, res) {
    res.status(200).json(policies)
}