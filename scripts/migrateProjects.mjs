import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yayoyrouufztwxygsuph.supabase.co";
const supabaseKey = "sb_publishable_PjWnv-FaVMWAZjVcyOF6Vw_hfP93zN5";
const supabase = createClient(supabaseUrl, supabaseKey);

const hardcodedItems = [
  {
    name: "DriveSiksha",
    category: "Flagship",
    status: "Live",
    description:
      "The complete operating system for driving institutes across Nepal. Student onboarding, instructor scheduling, vehicle rosters, licence-exam preparation and payments in one calm, reliable system.",
  },
  {
    name: "Himal Logistics Suite",
    category: "SaaS & Enterprise",
    status: "Live",
    description:
      "Fleet dispatch, consignment tracking, automated settlement and driver rosters for a national freight & logistics carrier in Nepal.",
  },
  {
    name: "Sahakari Core",
    category: "Fintech",
    status: "Live",
    description:
      "Member management, daily savings collector sync, deposit accounts, and loan ledger management for financial cooperative institutions.",
  },
  {
    name: "Aarambha LMS",
    category: "EdTech",
    status: "Live",
    description:
      "Blended learning platform with offline-first course video delivery, student progress tracking, and automated certification.",
  },
  {
    name: "Retail Pulse AI",
    category: "AI & Automation",
    status: "Live",
    description:
      "Demand forecasting, stock intelligence, and automated reorder triggers for retail chains operating across Kathmandu Valley.",
  },
  {
    name: "MediQueue",
    category: "SaaS & Enterprise",
    status: "Live",
    description:
      "Patient appointments, doctor triage rosters, prescription records, and billing workflow for a private clinic network.",
  },
  {
    name: "QubixDesk",
    category: "SaaS & Enterprise",
    status: "Beta",
    description:
      "Ticketing, customer support queues, and internal team task dispatch built for fast-scaling companies in Nepal.",
  },
  {
    name: "QubixPay Link",
    category: "Fintech",
    status: "Beta",
    description:
      "Instant payment links, automated digital receipts, and bank reconciliation for Nepali small businesses.",
  },
  {
    name: "QubixIQ",
    category: "AI & Automation",
    status: "Beta",
    description:
      "AI document parsing, optical character recognition, and automated data extraction for compliance-heavy financial workflows.",
  },
];

async function insert() {
  const { data, error } = await supabase.from("projects").insert(hardcodedItems);
  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Successfully migrated hardcoded projects to Supabase DB:", data);
  }
}

insert();
