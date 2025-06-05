interface ClinicDetailType {
    id: any;               // Corresponds to 'Id' in the class
    name?: string;            // Corresponds to 'Name' (optional)
    address?: string;         // Corresponds to 'Address' (optional)
    phone?: string;           // Corresponds to 'Phone' (optional)
    introductionHtml?: string; // Corresponds to 'IntroductionHtml' (optional)
    introductionMarkdown?: string;
    description?: string;
    image?: string; 
}

export default ClinicDetailType
