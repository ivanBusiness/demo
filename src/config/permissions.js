const permissions = [
  {
    role: "irAdmin",
    label: "IR Admin",
    permissions: {
      "IR Master": false,
      "IR Configuration": false,
    },
  },
  {
    role: "incidentReporter",
    label: "IR Reporter",
    permissions: {
      "Incident Reporting": false,
      "My Dashboard": false,
      "IR Query Dashboard": false,
      // "View access to reported incident by self": false,
      // "View Access to Root cause analysis tab": false,
      // "View Access to CAPA tab": false,
      "View Access to IR closure tab": false,
      "Incident closure dashboard": false,
      "CAPA dashboard - access and update CAPA's marked reponsible for": false,
      "Print Reported IR's": false,
    },
  },
  {
    role: "irInvestigator",
    label: "IR Investigator",
    permissions: {
      "Access to view IRs": false,
      "Merge IRs": false,
      "Cancel IR": false,
      "Update IR investigation for assigned IRs": false,
      "CAPA Dashboard - Update CAPA for assigned IRs": false,
      "CAPA Dashboard - access and update CAPA's marked responsible for": false,
      "Update IR Closure": false,
      "Recity IR information for assigned IR": false,
      "Update Reportable incident information": false,
      "Add addendum": false,
      "IR Analytics": {
        "Quick Insights": false,
        "Data Analytics": false,
      },
      "Custom Reports": {
        "Monthly IR Reports": false,
        "Injury Reports": false,
        "CAPA Reports": false,
      },
      Print: {
        "Reported IR": false,
        "IR Closure Screen": false,
      },
    },
  },
  {
    role: "incidentManager",
    label: "IR Manager",
    permissions: {
      "Access and update all IRs": false,
      "Quality Dashboard": false,
      "Cancel IR": false,
      "Assign IRs": false,
      "Merge IRs": false,
      "CAPA dashboard - Access for CAPA's of all IRs": false,
      "IR Analytics": {
        "Quick Insights": false,
        "Data Analytics": false,
      },
      "Custom Reports": {
        "Monthly IR Reports": false,
        "Injury Reports": false,
        "CAPA Reports": false,
      },
      Print: {
        "Reported IR": false,
        "IR Closure Screen": false,
      },
    },
  },
  {
    role: "hod",
    label: "Head of Department",
    permissions: {
      "Acknowledge IR": false,
      "View Departments IR": false,
    },
  },
];

export default permissions;
