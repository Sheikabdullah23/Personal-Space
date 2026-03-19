// force-app/main/default/lwc/sfRoadmap/sfRoadmap.js
import { LightningElement, track } from 'lwc';
import loadProgress from '@salesforce/apex/SFRoadmapController.loadProgress';
import saveProgress from '@salesforce/apex/SFRoadmapController.saveProgress';
import resetProgress from '@salesforce/apex/SFRoadmapController.resetProgress';

// ─────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────
const LEVELS = [
    { id: 'beginner', label: 'Beginner', emoji: '🌱', color: '#22c55e', bg: '#052e16', border: 'rgba(34,197,94,0.25)', tag: '0–6 months' },
    { id: 'intermediate', label: 'Intermediate', emoji: '🔥', color: '#f59e0b', bg: '#1c1002', border: 'rgba(245,158,11,0.25)', tag: '6–18 months' },
    { id: 'advanced', label: 'Advanced', emoji: '⚡', color: '#ef4444', bg: '#1c0505', border: 'rgba(239,68,68,0.25)', tag: '18+ months' },
];

const CLOUDS = [
    { id: 'core', name: 'SF Dev Core', icon: '🏗️', cert: 'Salesforce Developer I & II' },
    { id: 'sales', name: 'Sales Cloud', icon: '💼', cert: 'Sales Cloud Consultant' },
    { id: 'service', name: 'Service Cloud', icon: '🎧', cert: 'Service Cloud Consultant' },
    { id: 'data', name: 'Data Cloud', icon: '🌐', cert: 'Data Cloud Consultant' },
    { id: 'marketing', name: 'Marketing Cloud', icon: '📣', cert: 'MC Developer / Consultant' },
    { id: 'agentforce', name: 'Agentforce', icon: '🤖', cert: 'AI Associate / AI Specialist' },
    { id: 'fsc', name: 'Fin. Services', icon: '🏦', cert: 'FSC Accredited Professional' },
];

const DATA = {
    core: {
        beginner: [
            {
                phase: 'Platform Fundamentals', topics: [
                    { name: 'Salesforce Navigation & Setup Menu', detail: 'Home, App Launcher, Setup hierarchy, search setup, Org overview, My Domain.' },
                    { name: 'Standard Objects Deep Dive', detail: 'Lead, Contact, Account, Opportunity, Case — fields, relationships, page layouts for each.' },
                    { name: 'Field Types & Relationships', detail: 'Text, Number, Date, Picklist, Formula, Roll-Up Summary. Lookup vs Master-Detail, Many-to-Many via Junction.' },
                    { name: 'Record Types & Page Layouts', detail: 'When to use record types, assigning layouts per profile, compact layouts, related lists.' },
                    { name: 'Data Import & Export', detail: 'Data Import Wizard, Data Loader (insert/update/upsert/delete), Export via Reports, dataloader.io.' },
                ]
            },
            {
                phase: 'Declarative Automation', topics: [
                    { name: 'Flow Builder Basics', detail: 'Screen Flows, Auto-launched Flows — elements: Assignment, Decision, Loop, Screen, Get/Update/Create/Delete Records.' },
                    { name: 'Validation Rules', detail: 'Formula syntax, ISBLANK, ISPICKVAL, cross-object references, error message placement.' },
                    { name: 'Approval Processes', detail: 'Entry criteria, approval steps, approver assignment, recall actions, email templates for notifications.' },
                    { name: 'Reports & Dashboards', detail: 'Tabular, Summary, Matrix, Joined reports. Filters, groupings, charts. Dynamic dashboards.' },
                    { name: 'AppExchange Basics', detail: 'Installing managed packages, understanding namespace prefixes, package versions, security review basics.' },
                ]
            },
            {
                phase: 'Security & Access', topics: [
                    { name: 'Profiles & Permission Sets', detail: 'Object CRUD, FLS, App access per profile. Permission Sets as additive layers. Permission Set Groups.' },
                    { name: 'Roles & OWD (Org-Wide Defaults)', detail: 'Role hierarchy for record access, OWD settings (Public/Private/Read-Only), impact on sharing.' },
                    { name: 'Sharing Rules & Manual Sharing', detail: 'Criteria-based vs owner-based sharing rules, manual sharing, teams (Account/Opportunity/Case).' },
                    { name: 'Sandbox Types', detail: 'Developer, Developer Pro, Partial, Full — storage limits, refresh intervals, use cases for each.' },
                    { name: 'Change Sets (Deploy Basics)', detail: 'Outbound/inbound change sets, adding components, deploying between orgs, what cannot be deployed.' },
                ]
            },
        ],
        intermediate: [
            {
                phase: 'Apex Foundations', topics: [
                    { name: 'Apex Language Basics', detail: 'Classes, interfaces, access modifiers, static vs instance. Data types: primitives, sObjects, collections (List, Set, Map).' },
                    { name: 'DML Operations & SOQL', detail: 'insert, update, upsert, delete, undelete. SOQL basics: SELECT, WHERE, ORDER BY, LIMIT. Relationship queries.' },
                    { name: 'Apex Triggers', detail: 'before/after insert/update/delete/undelete. Trigger context variables (Trigger.new, Trigger.old). Handler pattern.' },
                    { name: 'Governor Limits', detail: 'SOQL 100, DML 150, Heap 6MB, CPU 10s. Bulkification: never query/DML inside loops. Limits class for monitoring.' },
                    { name: 'Exception Handling & Debug', detail: 'try/catch/finally, DmlException, QueryException. System.debug() levels. Debug logs in Setup. Anonymous Apex.' },
                ]
            },
            {
                phase: 'Lightning Web Components', topics: [
                    { name: 'LWC Component Structure', detail: 'HTML template, JS controller, meta.xml. @api, @track, @wire decorators. Component lifecycle hooks.' },
                    { name: 'Data Binding & Expressions', detail: 'Template syntax: {variable}, lwc:if. Iteration with for:each and iterator.' },
                    { name: 'Wire Service & Apex Integration', detail: '@wire with getRecord, getObjectInfo. @wire with Apex methods (cacheable). Imperative Apex calls from JS.' },
                    { name: 'LWC Events & Communication', detail: 'Custom events (CustomEvent, bubbles/composed), parent-child with @api, sibling via LMS (Lightning Message Service).' },
                    { name: 'Lightning App Builder', detail: 'Making LWC configurable (targetConfigs), Dynamic Interactions, App/Home/Record pages.' },
                ]
            },
            {
                phase: 'Testing & Deployment', topics: [
                    { name: 'Apex Unit Testing', detail: '@isTest annotation, Test.startTest/stopTest for governor limits. 75% code coverage minimum. Test.setMock for callouts.' },
                    { name: 'Test Data Factories', detail: 'TestDataFactory class pattern, @testSetup method for shared data, SeeAllData=false best practices.' },
                    { name: 'Asynchronous Apex', detail: 'Future methods (@future), Batch Apex (Database.Batchable), Queueable Apex (chaining), Scheduled Apex (cron).' },
                    { name: 'Integration Basics (REST/SOAP)', detail: 'HttpRequest/HttpResponse, JSON.serialize/deserialize, Named Credentials, callout from Apex, WSDL import.' },
                    { name: 'Source Control Concepts', detail: 'Git basics for Salesforce: commit, branch, pull request. VS Code + Salesforce CLI. sfdx project structure.' },
                ]
            },
        ],
        advanced: [
            {
                phase: 'Enterprise Apex Architecture', topics: [
                    { name: 'Trigger Frameworks (TDTM / fflib)', detail: 'Separation of concerns: TriggerHandler interface, domain classes, avoiding multiple triggers per object.' },
                    { name: 'Async Apex Patterns', detail: 'Batch chaining with Database.executeBatch in finish(), Queueable chaining with System.enqueueJob(), Apex Flex Queue.' },
                    { name: 'Platform Events & CDC', detail: 'Publish-subscribe with EventBus, replay ID for missed events, Change Data Capture (CDC) for real-time sync.' },
                    { name: 'Custom Metadata & Custom Settings', detail: 'CMT vs CS decision matrix: deployment, protected, cross-org. Apex access patterns.' },
                    { name: 'Enterprise Design Patterns', detail: 'Service Layer, Selector Layer, Domain Layer (fflib), Unit of Work, Dependency Injection in Apex.' },
                ]
            },
            {
                phase: 'Advanced LWC & UI', topics: [
                    { name: 'LWC Advanced: Slots & Composition', detail: 'Named slots, default slots, component composition patterns, Shadow DOM implications, slotchange event.' },
                    { name: 'Performance Optimization', detail: 'Wire caching strategies, lazy loading, virtual rendering in lists, Lightning Locker vs LWS implications.' },
                    { name: 'Lightning Navigation & Workspace API', detail: 'NavigationMixin, open records/tabs in console, workspace API for multi-tab management in Service Console.' },
                    { name: 'Experience Cloud LWC', detail: 'Guest user context, community templates, LWC for portals, data access in Experience Cloud, Apex guest access.' },
                    { name: 'Visualforce Interop', detail: 'VF pages in Lightning, $Component references, Remoting vs Remote Objects, when VF still needed (PDF rendering).' },
                ]
            },
            {
                phase: 'DevOps & Architecture', topics: [
                    { name: 'Unlocked Packages & 2GP', detail: 'Package development model, package versions, dependencies, pushing to scratch orgs, promoting to production.' },
                    { name: 'Scratch Orgs & Source-Driven Dev', detail: 'project-scratch-def.json, scratch org features, source push/pull, org shape, org snapshot.' },
                    { name: 'CI/CD Pipelines', detail: 'GitHub Actions for SFDX, Copado pipelines, delta deployments (sfdx-git-delta), Apex test execution in CI.' },
                    { name: 'Well-Architected Framework', detail: 'Salesforce Well-Architected: Trusted, Easy, Adaptable. Design principles for scalable multi-org architecture.' },
                    { name: 'Security Architecture', detail: 'FLS enforcement in Apex (WITH SECURITY_ENFORCED / stripInaccessible), CRUD checks, Shield Platform Encryption.' },
                ]
            },
        ],
    },
    sales: {
        beginner: [
            {
                phase: 'Core Sales Objects', topics: [
                    { name: 'Lead Management', detail: 'Lead sources, lead stages, Web-to-Lead setup, lead assignment rules, lead conversion mapping.' },
                    { name: 'Account & Contact', detail: 'Account hierarchy, person accounts vs business accounts, contact roles on opportunities, account teams.' },
                    { name: 'Opportunity Management', detail: 'Opportunity stages, probability, close date, forecast category. Opportunity Products & Price Books.' },
                    { name: 'Activities & Tasks', detail: 'Tasks, Events, Emails — logging activities, activity timeline, Open/Closed Activities related lists.' },
                    { name: 'Campaigns', detail: 'Campaign types, campaign members, ROI tracking, campaign influence models, campaign hierarchy.' },
                ]
            },
            {
                phase: 'Sales Automation', topics: [
                    { name: 'Assignment Rules', detail: 'Lead and Case assignment rules — criteria-based, round-robin via Apex, queue assignments.' },
                    { name: 'Email Templates & Alerts', detail: 'Classic vs Lightning templates, merge fields, workflow email alerts, letterheads, folder organization.' },
                    { name: 'Path Configuration', detail: 'Sales Path on Opportunity, Guidance for Success per stage, Key Fields per stage, configuring via Setup.' },
                    { name: 'Duplicate Management', detail: 'Matching rules, duplicate rules, alert vs block, merge records, duplicate sets report.' },
                    { name: 'Sales Reports & Dashboards', detail: 'Pipeline by stage, Stale Opportunities, Won/Lost Analysis, Activity reports, forecast dashboards.' },
                ]
            },
            {
                phase: 'Productivity Features', topics: [
                    { name: 'Einstein Activity Capture', detail: 'Email/calendar sync, activity metrics, EAC settings, what gets synced, compliance considerations.' },
                    { name: 'Salesforce Inbox', detail: 'Inbox app, email integration, scheduling links, tracking opens, creating leads from emails.' },
                    { name: 'Chatter for Sales', detail: 'Following records, @mentions, groups, Chatter notifications, Chatter feed on opportunity.' },
                    { name: 'AppExchange Sales Apps', detail: 'DocuSign, Conga, LinkedIn Sales Navigator integration — evaluating managed packages for sales teams.' },
                    { name: 'Mobile App for Sales', detail: 'Salesforce Mobile app configuration, compact layouts, mobile navigation, offline access basics.' },
                ]
            },
        ],
        intermediate: [
            {
                phase: 'Advanced Sales Features', topics: [
                    { name: 'Collaborative Forecasting', detail: 'Enabling forecasting, forecast types, adjustments, forecast hierarchy, quota management, forecast views.' },
                    { name: 'Territory Management (Basic)', detail: 'Territory models, territory types, assigning accounts to territories, territory-based forecasting.' },
                    { name: 'CPQ Fundamentals', detail: 'CPQ setup, Product Catalog, Bundles, Pricing (List/Block/Contracted), Quote creation and approval workflow.' },
                    { name: 'Opportunity Splits', detail: 'Revenue splits, overlay splits, configuring split types, reporting on splits.' },
                    { name: 'Einstein Lead & Opportunity Scoring', detail: 'Einstein Scoring setup, score fields, score reasons, feeding data back into sales process via flows.' },
                ]
            },
            {
                phase: 'Developer Automation', topics: [
                    { name: 'Apex on Opportunity', detail: 'Before/after triggers for stage validation, custom close-date enforcement, auto-creating follow-up tasks.' },
                    { name: 'Flow for Sales Processes', detail: 'Guided selling Screen Flows, auto-launched flows for opp field updates, scheduled flows for stale alerts.' },
                    { name: 'Custom Opportunity Stages', detail: 'Custom stage picklist values, stage-to-probability mapping, forecast category assignment.' },
                    { name: 'REST API for Sales Data', detail: 'CRUD on Opportunity via REST, query pipeline via SOQL API, Bulk API for large data refreshes.' },
                    { name: 'Reports API', detail: 'Running reports via REST, extracting report data programmatically, integrating with BI tools.' },
                ]
            },
            {
                phase: 'Integration', topics: [
                    { name: 'Salesforce + Gmail/Outlook', detail: 'Einstein Activity Capture vs Salesforce for Outlook, sync settings, limitations, compliance.' },
                    { name: 'Salesforce Maps', detail: 'Geolocation fields, map views, route optimization, territory planning with Maps.' },
                    { name: 'Marketing Cloud Connect', detail: 'MCC sync for lead/contact data, campaign syncing, MC journeys triggered by CRM events.' },
                    { name: 'Data Import for Sales', detail: 'Bulk loading opportunities from CRM exports, deduplication strategies, rollback planning.' },
                    { name: 'Event Monitoring for Sales', detail: 'Login history, API usage, report export audit — compliance for sales data access.' },
                ]
            },
        ],
        advanced: [
            {
                phase: 'Architecture', topics: [
                    { name: 'Territory Management 2.0', detail: 'Territory hierarchy design, assignment rules, territory types, user assignment, forecasting integration.' },
                    { name: 'Advanced CPQ', detail: 'Product rules (selection/validation/alert/filter), price rules (calculator & field triggers), twin fields.' },
                    { name: 'Revenue Cloud', detail: 'Order management, contract creation from CPQ quote, amendments, renewals, subscription products.' },
                    { name: 'Sales Engagement (HVS)', detail: 'Cadences setup, Einstein Activity Capture deep config, Sales Dialer integration, rep productivity analytics.' },
                    { name: 'Revenue Intelligence', detail: 'CRM Analytics for Sales, Pipeline Inspection, Deal Insights, AI-powered forecast signals.' },
                ]
            },
            {
                phase: 'Developer Deep-Dives', topics: [
                    { name: 'Complex SOQL Optimization', detail: 'Semi-joins (IN subquery), anti-joins (NOT IN), query plan tool, selective query design, custom indexes.' },
                    { name: 'Trigger Frameworks on Sales Objects', detail: 'fflib / TDTM applied to Lead, Opportunity, Account triggers. Recursive trigger prevention, bypass mechanisms.' },
                    { name: 'Platform Events for Pipeline', detail: 'Real-time opp update events, external system notifications on stage change, replay ID management.' },
                    { name: 'Einstein Scoring API', detail: 'Reading AI score fields via Apex, surfacing scores in LWC, feeding scores into flow-based routing.' },
                    { name: 'Custom Metadata for Sales Config', detail: 'Stage-to-action mapping via CMT, territory assignment rules as CMT, environment-specific sales config.' },
                ]
            },
            {
                phase: 'Integration & Deployment', topics: [
                    { name: 'ERP Integration Patterns', detail: 'Salesforce as system-of-engagement vs ERP as system-of-record: event-driven vs polling, idempotent upsert.' },
                    { name: 'Composite & Bulk API', detail: 'Composite API for multi-object transactions, Bulk API 2.0 for mass updates, Streaming API for real-time sync.' },
                    { name: 'CI/CD for Sales Cloud Orgs', detail: 'Unlocked packages for sales customizations, delta deployments via sfdx-git-delta, Apex test selection.' },
                    { name: 'Permission Set Architecture', detail: 'Permission set groups for sales roles, muting permissions, field-level security design per sales segment.' },
                    { name: 'LWC Sales Console Components', detail: 'Custom utility bar items for pipeline health, workspace API for multi-record management, guidance panel LWC.' },
                ]
            },
        ],
    },
    service: {
        beginner: [
            {
                phase: 'Case Management Basics', topics: [
                    { name: 'Case Object & Fields', detail: 'Case status, priority, type, origin. Case number auto-generation, case owner, queue assignment.' },
                    { name: 'Email-to-Case & Web-to-Case', detail: 'Setting up Email-to-Case (routing addresses), Web-to-Case form, case auto-response rules.' },
                    { name: 'Case Assignment Rules', detail: 'Criteria-based assignment, routing to queues vs users, assignment rule activation, escalation as fallback.' },
                    { name: 'Queues & List Views', detail: 'Creating queues, adding members, queue email notifications, list views for triage, queue ownership.' },
                    { name: 'Service Console Basics', detail: 'Console app setup, Utility Bar items (Open CTI, notes, history), multi-tab navigation, keyboard shortcuts.' },
                ]
            },
            {
                phase: 'Knowledge & Support', topics: [
                    { name: 'Knowledge Articles', detail: 'Article types, creating/editing/publishing articles, article lifecycle (Draft/Review/Published), article archiving.' },
                    { name: 'Data Categories & Visibility', detail: 'Category groups, categories, assigning to articles, visibility based on profiles.' },
                    { name: 'Entitlements Basics', detail: 'Entitlement records linked to accounts/contacts, entitlement lookup on cases, entitlement templates.' },
                    { name: 'Macros', detail: 'Creating macros for repetitive case actions (update fields, send email, close case), macro sharing.' },
                    { name: 'Basic Case Reports', detail: 'Cases by status, SLA compliance, agent performance, case age reports, resolution time dashboards.' },
                ]
            },
            {
                phase: 'Communication', topics: [
                    { name: 'Omni-Channel Basics', detail: 'Enabling Omni-Channel, agent presence, routing configurations, Service Channel setup, work item routing.' },
                    { name: 'Quick Text', detail: 'Creating quick text messages, sharing with teams, inserting in email/chat composer, category organization.' },
                    { name: 'Live Agent / Messaging Basics', detail: 'Live Agent setup, chat buttons, pre-chat forms, supervisor features, chat transcripts saved to cases.' },
                    { name: 'Case Escalation Rules', detail: 'Escalation rules based on case age/criteria, escalation actions (reassign, email), escalation timers.' },
                    { name: 'Chatter for Service', detail: 'Case feed, @mentioning experts, Chatter groups for L1/L2/L3, following cases for updates.' },
                ]
            },
        ],
        intermediate: [
            {
                phase: 'Advanced Case Features', topics: [
                    { name: 'Entitlement Processes & SLA', detail: 'Entitlement process setup, milestone criteria, milestone actions (email, field update), violation actions.' },
                    { name: 'Case Hierarchies & Merge', detail: 'Parent-child case relationships, case merge (up to 3 cases), master record selection.' },
                    { name: 'Case Routing with Skills', detail: 'Skills-based routing in Omni-Channel, agent skills/levels, routing rules matching skills to work items.' },
                    { name: 'Einstein Bots (Basic)', detail: 'Bot setup in Service Cloud, dialog design, NLP intent recognition, slot filling, variable mapping.' },
                    { name: 'Service Analytics (CRM Analytics)', detail: 'Service Cloud Einstein dashboards: case volume trends, CSAT scores, backlog analysis, handle time.' },
                ]
            },
            {
                phase: 'Knowledge & Self-Service', topics: [
                    { name: 'Knowledge Search Optimization', detail: 'Smart links, promoted search terms, data category filtering, knowledge article scoring, search results tuning.' },
                    { name: 'Experience Cloud for Service', detail: 'Self-service community template, guest user access to knowledge, case submission portal.' },
                    { name: 'Einstein Article Suggestions', detail: 'AI-powered article recommendations in case feed, setting up Einstein Knowledge, relevance training.' },
                    { name: 'Article Versioning & Translation', detail: 'Draft versions, publish versioning, translation workbench for multilingual knowledge bases.' },
                    { name: 'Feedback & CSAT', detail: 'Survey integration (Salesforce Surveys), CSAT score capture, survey triggers after case close.' },
                ]
            },
            {
                phase: 'Developer Skills', topics: [
                    { name: 'Apex for Case Automation', detail: 'Before-insert trigger for auto-routing, after-update for SLA breach detection, bulk case processing patterns.' },
                    { name: 'LWC for Service Console', detail: 'Custom case summary component, related account info component, agent productivity panels.' },
                    { name: 'CTI Adapter Basics (Open CTI)', detail: 'Open CTI API overview, softphone layout configuration, screen pop basics, call logging to case.' },
                    { name: 'Flow for Case Escalation', detail: 'Scheduled flows for SLA breach alerts, auto-launched flow on case status change, sub-flows for reuse.' },
                    { name: 'Custom Report Types for Cases', detail: 'Creating CRT: Cases with Entitlements, Cases with Knowledge, enabling new data combinations.' },
                ]
            },
        ],
        advanced: [
            {
                phase: 'Omni-Channel Deep Dive', topics: [
                    { name: 'Advanced Routing Configurations', detail: 'Capacity-based routing, external routing via Apex (IRouting interface), Omni-Channel Flow routing.' },
                    { name: 'Omni-Channel Supervisor', detail: 'Real-time agent monitoring, queue backlog, agent status history, Wallboard API for external display.' },
                    { name: 'Einstein Case Classification', detail: 'AI-powered field prediction (type/priority/reason), training classification model, accuracy monitoring.' },
                    { name: 'Next Best Action in Service', detail: 'Recommendation strategy design, NBA component in Service Console, action embedding in LWC utility bar.' },
                    { name: 'Service Cloud Analytics Deep Dive', detail: 'Custom CRM Analytics apps for service, predictive CSAT, real-time queue dashboards, agent scorecards.' },
                ]
            },
            {
                phase: 'Developer Topics', topics: [
                    { name: 'CTI Adapter Development', detail: 'Full Open CTI implementation: softphone events (onClickToDial, saveLog), screen pop via NavigationMixin.' },
                    { name: 'Service Cloud Voice', detail: 'Amazon Connect integration architecture, real-time transcription setup, post-call summarization.' },
                    { name: 'Visual Remote Assistance', detail: 'VRA SDK setup, embedded component deployment, annotation tools, compliance considerations.' },
                    { name: 'LWC Workspace API', detail: 'openTab, closeTab, focusTab, getTabInfo — building intelligent multi-record agent desktops.' },
                    { name: 'Messaging for In-App & Web', detail: 'Embedded Service SDK deployment, session routing, pre-chat data capture, bot-to-agent handoff architecture.' },
                ]
            },
            {
                phase: 'Advanced Patterns', topics: [
                    { name: 'High-Volume Case Processing', detail: 'Async Apex for bulk case updates, Platform Events for case status broadcasts, CDC for external system sync.' },
                    { name: 'Guest User Security in Portals', detail: 'OWD for guest access, Apex sharing for guest visibility, CSRF protection, guest profile hardening.' },
                    { name: 'Omni-Channel & External Systems', detail: 'Routing work items from external systems, external routing partner API, work item lifecycle management.' },
                    { name: 'Service GPT / Agentforce for Service', detail: 'Einstein Copilot in Service Cloud, service agent automation, escalation to live agent, transcript summaries.' },
                    { name: 'Performance Tuning', detail: 'Large data volume strategies for Cases, skinny tables, custom indexes, search index optimization.' },
                ]
            },
        ],
    },
    data: {
        beginner: [
            {
                phase: 'Platform Orientation', topics: [
                    { name: 'What is Salesforce Data Cloud?', detail: 'Customer Data Platform (CDP) concepts, unified customer profile, Data Cloud vs standard CRM, licensing overview.' },
                    { name: 'Data Cloud Interface', detail: 'Navigating Data Cloud home, Data Explorer, Identity Resolution panel, Segment Builder, Activation targets.' },
                    { name: 'Core Concepts: DMOs', detail: 'Data Model Objects (DMOs) = tables in Data Cloud. Standard vs custom DMOs, subject areas, attributes.' },
                    { name: 'Connecting Salesforce CRM', detail: 'Salesforce CRM connector setup, selecting objects to sync, field mapping, initial sync and incremental refreshes.' },
                    { name: 'Profile Explorer', detail: 'Viewing a Unified Individual, seeing linked contact points, viewing ingested data across DMOs for one person.' },
                ]
            },
            {
                phase: 'Data Ingestion Basics', topics: [
                    { name: 'Data Streams', detail: 'What is a Data Stream, creating a data stream from a file/S3, field mapping to DMO attributes, refresh modes.' },
                    { name: 'Ingestion API (Basics)', detail: 'REST-based data ingestion, bulk vs streaming ingestion, payload format, authentication, checking ingestion jobs.' },
                    { name: 'S3 Connector', detail: 'Configuring S3 connector, IAM setup, file format requirements (CSV, JSON, Parquet), scheduled ingestion.' },
                    { name: 'Data Quality Basics', detail: 'Null handling, type validation, rejected records, monitoring ingestion errors in Data Cloud setup.' },
                    { name: 'Refresh Schedules', detail: 'On-demand vs scheduled refreshes, full vs incremental, refresh frequency considerations for data freshness.' },
                ]
            },
            {
                phase: 'Basic Segmentation', topics: [
                    { name: 'Segment Builder Introduction', detail: 'Creating your first segment, attribute filters on DMO fields, AND/OR logic, segment membership count.' },
                    { name: 'Activation Basics', detail: 'What is an activation target, CRM activation (pushing segment to Campaign), basic mapping.' },
                    { name: 'Data Cloud Dashboards', detail: 'Unified Individual counts, segment size trends, data stream status, identity resolution stats overview.' },
                    { name: 'Consent Management Basics', detail: 'Contact point consent, consent data streams, what consent means in Data Cloud context.' },
                    { name: 'Data Cloud for Marketers', detail: 'How marketers use segments, audience activation to Marketing Cloud, basic use case walkthrough.' },
                ]
            },
        ],
        intermediate: [
            {
                phase: 'Data Model Mastery', topics: [
                    { name: 'Standard DMO Hierarchy', detail: 'Individual, Contact Point (Email/Phone/Address/App), Unified Individual, Party Identification, related DMOs.' },
                    { name: 'Custom DMOs', detail: 'Creating custom DMOs, defining attributes, setting primary key, establishing relationships to standard DMOs.' },
                    { name: 'Formula Fields', detail: 'Derived/computed fields at the DMO level, formula operators, data type outputs, use in segmentation.' },
                    { name: 'Data Transforms', detail: 'SQL-based transforms in Data Cloud, scheduled vs streaming transforms, output to new DMO, chain transforms.' },
                    { name: 'Marketing Cloud Connector', detail: 'Bidirectional sync with MC, syncing Contacts/Subscribers, sending segment data to MC Data Extensions.' },
                ]
            },
            {
                phase: 'Identity Resolution', topics: [
                    { name: 'Identity Resolution Ruleset', detail: 'Match rules: fuzzy vs exact, field-level match strategies (email, phone, name+DOB). Rule priority and ordering.' },
                    { name: 'Reconciliation Rules', detail: 'Determining which value wins on unified profile: Most Recent, Most Common, Source Priority.' },
                    { name: 'Unified Individual Object', detail: 'How Unified Individual is created from Individual records, link count, resolution confidence.' },
                    { name: 'Contact Point Linking', detail: 'How contact point (email/phone) links back to Unified Individual, multi-email identity scenarios.' },
                    { name: 'Monitoring Identity Resolution', detail: 'IR job runs, unresolved records, match rate KPIs, troubleshooting poor match rates.' },
                ]
            },
            {
                phase: 'Segmentation & Activation', topics: [
                    { name: 'Advanced Segment Logic', detail: 'Nested filters, related DMO segments (e.g., filter by purchase history on Order DMO), exclusion segments.' },
                    { name: 'Calculated Insights (Intro)', detail: 'Creating Calculated Insights with SQL, metric DMOs as output, using CI attributes in segment criteria.' },
                    { name: 'Waterfall Segments', detail: 'Priority-based segmentation: first segment wins exclusion pattern, customer tiering use cases.' },
                    { name: 'Marketing Cloud Activation', detail: 'MC activation target setup, field mapping to Data Extensions, contact point priority, send scheduling.' },
                    { name: 'Real-Time Event Data', detail: 'Web SDK events, streaming ingestion for clickstream, using event attributes in real-time segmentation.' },
                ]
            },
        ],
        advanced: [
            {
                phase: 'Advanced Architecture', topics: [
                    { name: 'Calculated Insights: ANSI SQL', detail: 'Complex GROUP BY, HAVING, window functions, time-based rollups (30d/60d/90d), joining across multiple DMOs.' },
                    { name: 'Streaming Transforms vs Batch', detail: 'Use cases for each: streaming for real-time profile updates, batch for aggregations, latency trade-offs.' },
                    { name: 'Vector Search & Embeddings', detail: 'Indexing text data for vector search, semantic similarity queries, use in Agentforce RAG grounding.' },
                    { name: 'Data Pipeline Architecture', detail: 'Multi-source ingestion strategy, transform chain design, DMO dependency graphs, schema versioning.' },
                    { name: 'Large Data Volume (LDV) Patterns', detail: 'Segment performance on billions of records, Calculated Insights query optimization, index strategies in DC.' },
                ]
            },
            {
                phase: 'APIs & Integration', topics: [
                    { name: 'Bulk Ingestion API', detail: 'Batch job creation, file upload (multipart), job monitoring, error record retrieval, retry patterns.' },
                    { name: 'Query API', detail: 'ANSI SQL queries over Data Cloud via REST, pagination, async query jobs for large result sets.' },
                    { name: 'Profile API', detail: 'Retrieving unified profile by ID or email, contact points, segment membership lookup via API.' },
                    { name: 'Data Cloud for Agentforce (RAG)', detail: 'Grounding agent prompts with Data Cloud, object grounding vs unstructured search, embedding refresh schedule.' },
                    { name: 'Einstein Studio', detail: 'Bring-your-own ML model, Predict DMO as output, connecting predictions to CRM Next Best Action.' },
                ]
            },
            {
                phase: 'Governance & Compliance', topics: [
                    { name: 'GDPR/CCPA Consent Model', detail: 'Consent data streams, contact point opt-in/opt-out, consent propagation to MC/activation targets.' },
                    { name: 'Purpose-Based Consent', detail: 'Data use purposes, consent capture across channels, Data Cloud consent API, right-to-erasure workflows.' },
                    { name: 'Data Retention Policies', detail: 'Retention rules per DMO, automated record deletion, compliance reporting, retention vs analytics trade-off.' },
                    { name: 'Data Cloud Security Model', detail: 'Org-level permissions, Data Space access, Segment-level sharing, admin vs viewer roles.' },
                    { name: 'Monitoring & Observability', detail: 'Ingestion job health, IR run metrics, segment refresh SLA, Data Cloud event log integration with SIEM.' },
                ]
            },
        ],
    },
    marketing: {
        beginner: [
            {
                phase: 'Platform Basics', topics: [
                    { name: 'SFMC Interface Overview', detail: 'Marketing Cloud home, studio navigation (Email/Mobile/Social/Advertising), AppExchange for MC, account switcher.' },
                    { name: 'Subscribers & Lists', detail: 'All Subscribers list, Publication Lists, Suppression Lists, subscriber statuses (Active/Bounced/Unsubscribed/Held).' },
                    { name: 'Email Studio Basics', detail: 'Creating emails (HTML paste vs template), Content Builder introduction, preheader, subject line best practices.' },
                    { name: 'Guided Send', detail: 'Send Flow: Select Content, Define Properties, Select Audience, Configure Delivery, Review & Send.' },
                    { name: 'Tracking & Reporting', detail: 'Email Sends report, opens/clicks/bounces/unsubscribes, link tracking, send summary, impression tracking.' },
                ]
            },
            {
                phase: 'Contact Management', topics: [
                    { name: 'Data Extensions Basics', detail: 'What is a Data Extension vs list, creating DEs, field types, sendable vs non-sendable DEs, required fields.' },
                    { name: 'Import Activity', detail: 'Importing CSV files into DEs, file delimiter settings, field mapping, import behavior (Add/Update/Overwrite).' },
                    { name: 'Unsubscribe Management', detail: 'One-click unsubscribe, Unsubscribe Center, Custom Unsubscribe pages with CloudPages, list-level unsubscribes.' },
                    { name: 'A/B Testing', detail: 'Subject line testing, from name testing, winner criteria (open rate/click rate/conversion), holdout groups.' },
                    { name: 'Content Builder Basics', detail: 'Content blocks: text, image, button, HTML. Templates, slots, locking sections. Folder organization.' },
                ]
            },
            {
                phase: 'Send & Compliance', topics: [
                    { name: 'Send Classifications', detail: 'Commercial vs transactional classification, CAN-SPAM/GDPR implications, sender profile, delivery profile.' },
                    { name: 'Bounce Management', detail: 'Soft vs hard bounces, bounce handling settings, Bounce Mail Management, re-engagement considerations.' },
                    { name: 'CAN-SPAM & GDPR Basics', detail: 'Required email elements (physical address, unsubscribe), consent types, double opt-in setup, audit trails.' },
                    { name: 'Basic Automation Studio', detail: 'Creating a simple automation: Import File, Query, Send Email. Schedule frequency, activity sequencing.' },
                    { name: 'Salesforce CRM Connect Basics', detail: 'Marketing Cloud Connect overview, synchronized objects (Leads/Contacts), campaign syncing basics.' },
                ]
            },
        ],
        intermediate: [
            {
                phase: 'Journey Builder', topics: [
                    { name: 'Journey Builder Architecture', detail: 'Entry sources: Audience (DE), API Event, Salesforce Data. Single entry vs re-entry. Contact data model in Journey.' },
                    { name: 'Journey Activities', detail: 'Email, SMS, Wait (duration/specific date/until attribute), Decision Split, Engagement Split, Update Contact.' },
                    { name: 'Multi-Step Journey Design', detail: 'Welcome series, re-engagement, post-purchase flows. Goal settings, exit criteria, hold-out groups.' },
                    { name: 'Journey Testing', detail: 'Test mode, injection via Test Entry, journey version management, pausing/stopping journeys safely.' },
                    { name: 'Transactional Messaging', detail: 'Transactional Send Journey, REST API for triggered sends, payload design, delivery speed vs marketing.' },
                ]
            },
            {
                phase: 'Developer Skills', topics: [
                    { name: 'AMPscript Fundamentals', detail: 'Variable declaration (VAR/SET), Lookup(), AttributeValue(), IIF(), FORMAT(), FOR loop, dynamic content.' },
                    { name: 'Dynamic Content Blocks', detail: 'Rules-based dynamic content in Content Builder, AMPscript-driven content, A/B vs dynamic content use cases.' },
                    { name: 'SQL in Automation Studio', detail: 'SELECT INTO for DE queries, JOIN across DEs, WHERE clause for filtering, scheduled automation patterns.' },
                    { name: 'CloudPages Basics', detail: 'Creating a Landing Page, Smart Capture form, reading form submissions, redirect after submit.' },
                    { name: 'Contact Builder Deep Dive', detail: 'Attribute Groups, linking DE to Contact via subscriber key, Cardinality settings (1:1 vs 1:many), population.' },
                ]
            },
            {
                phase: 'Data Management', topics: [
                    { name: 'Data Extension Design', detail: 'Sendable DE requirements, data retention policies, indexed fields for performance, polymorphic relationship DEs.' },
                    { name: 'Synchronized Data Extensions', detail: 'MCC sync: which objects/fields sync, sync frequency, using Synchronized DEs in Journey entry, filters.' },
                    { name: 'Marketing Cloud Connect Advanced', detail: 'CRM-triggered sends, Salesforce campaigns in MC, Synchronized DEs for personalization.' },
                    { name: 'FTP & File Management', detail: 'SFTP setup, Enhanced FTP directory structure, file naming conventions, import automation chaining.' },
                    { name: 'Subscriber Key Strategy', detail: 'Contact Key = Subscriber Key = CRM ID, implications of changing keys, Contact Key best practices.' },
                ]
            },
        ],
        advanced: [
            {
                phase: 'Platform Architecture', topics: [
                    { name: 'Business Unit Architecture', detail: 'Parent BU vs child BU, shared data extensions across BUs, lock and publish template strategy, content sharing.' },
                    { name: 'Account Hierarchy Design', detail: 'Enterprise vs Core account, sharing publications, suppression lists at parent level, governed sends.' },
                    { name: 'Transactional Messaging API', detail: 'REST API triggered sends, async vs sync delivery, event notification service, status callbacks, retry logic.' },
                    { name: 'Sender Authentication Package (SAP)', detail: 'SAP vs STON, custom domain setup, DKIM signing, dedicated IP warming, deliverability best practices.' },
                    { name: 'Contact Model at Scale', detail: 'Contact deletion, contactable counts, billing implications, All Contacts retention, identity resolution with DC.' },
                ]
            },
            {
                phase: 'Developer Mastery', topics: [
                    { name: 'AMPscript: WSProxy & SSJS Interop', detail: 'WSProxy for DE CRUD within AMPscript, calling SOAP API methods, mixing SSJS and AMPscript blocks.' },
                    { name: 'Server-Side JavaScript (SSJS)', detail: 'Platform.Load libraries, WSProxy for bulk operations, HTTP callouts from CloudPages, Platform.Function.' },
                    { name: 'Journey Builder API', detail: 'REST API event injection (EventDefinitionKey), custom Journey activities (auth/execute/publish/stop endpoints).' },
                    { name: 'Automation Studio Chaining', detail: 'Multi-step automation design, error activity, notification activity, executing automations via REST API.' },
                    { name: 'Security: Encryption & SFTP', detail: 'Encryption at rest, PGP encryption for SFTP files, IP allowlisting, OAuth for API, security best practices.' },
                ]
            },
            {
                phase: 'AI & Advanced Channels', topics: [
                    { name: 'Einstein for Marketing Cloud', detail: 'Send Time Optimization, Engagement Scoring, Subject Line Testing (AI), Predictive Audiences, Content Selection.' },
                    { name: 'Mobile Studio', detail: 'MobilePush (iOS/Android SDK), SMS/MMS (keyword responses), LINE/WeChat connectors, Beacon interactions.' },
                    { name: 'Advertising Studio & Data Cloud', detail: 'Audience sync to Facebook/Google, suppression audiences, Data Cloud segment activation to Advertising.' },
                    { name: 'MC Personalization (Formerly IS)', detail: 'Web SDK event capture, Catalog ingestion, Einstein recipes/boosters, A/B experience testing.' },
                    { name: 'Datorama / Marketing Cloud Intelligence', detail: 'Cross-channel reporting, connector setup (SFMC/GA/Meta), custom dashboards, API data streams for BI.' },
                ]
            },
        ],
    },
    agentforce: {
        beginner: [
            {
                phase: 'AI & LLM Foundations', topics: [
                    { name: 'Generative AI Basics for CRM', detail: 'What is a Large Language Model (LLM), tokens, temperature, prompt/completion, hallucination, grounding concepts.' },
                    { name: 'Salesforce AI Portfolio', detail: 'Einstein AI history, Einstein GPT, Copilot, Agentforce evolution, where each product fits today.' },
                    { name: 'Prompt Engineering 101', detail: 'System prompt vs user prompt, few-shot examples, chain-of-thought, role prompting, output formatting instructions.' },
                    { name: 'Einstein Trust Layer Overview', detail: 'What ETL does: data masking before LLM call, toxicity detection, zero-data retention, audit trail for AI.' },
                    { name: 'Agentforce Terminology', detail: 'Agent, Topic, Action, Instruction, Planner, Atlas Reasoning Engine — key vocabulary for the platform.' },
                ]
            },
            {
                phase: 'No-Code Einstein Features', topics: [
                    { name: 'Einstein Copilot (Now Agentforce)', detail: 'Using Agentforce in the sidebar, asking questions about records, auto-summarize, draft email, CRM navigation.' },
                    { name: 'Einstein Prompt Builder Basics', detail: 'Creating a Flex template, adding field merge fields, testing prompt output, associating with a record page.' },
                    { name: 'Einstein for Sales', detail: 'Deal Insights, Opportunity Summaries, Call Summaries, Email Compose with AI, Relationship Intelligence.' },
                    { name: 'Einstein for Service', detail: 'Case Summaries, Recommended Articles, Draft Reply with AI, Work Summary in Service Console.' },
                    { name: 'Next Best Action (Basic)', detail: 'NBA component on record page, creating a simple strategy with Flow, recommendation display and response.' },
                ]
            },
            {
                phase: 'Building Your First Agent', topics: [
                    { name: 'Agent Builder UI', detail: 'Creating an agent, setting agent type (CRM/External), writing system prompt, configuring topics and instructions.' },
                    { name: 'Topics & Instructions', detail: 'What is a Topic (scope boundary), writing instruction text, associating actions to a topic, testing scope.' },
                    { name: 'Pre-Built Actions', detail: 'Standard actions: Query Records, Update Record, Create Record, Send Email — wiring to a topic.' },
                    { name: 'Testing in Conversation Simulator', detail: 'Simulating user conversations, reviewing reasoning steps, iterating on prompts, checking action triggering.' },
                    { name: 'Deploying to a Channel', detail: 'Deploying an agent to Service Cloud, Experience Cloud, or Slack. Channel configuration and permissions.' },
                ]
            },
        ],
        intermediate: [
            {
                phase: 'Agent Architecture', topics: [
                    { name: 'Atlas Reasoning Engine', detail: 'How Atlas plans: intent classification, topic selection, action sequencing, response generation. Planner internals.' },
                    { name: 'Topics vs Actions Design', detail: 'One topic per intent domain, multiple actions per topic, instruction specificity, avoiding topic overlap conflicts.' },
                    { name: 'Action Types Deep Dive', detail: 'Flow action, Apex action, Prompt Template action, API (External Service) action — when to use each.' },
                    { name: 'Prompt Template Builder', detail: 'Flex templates vs auto-generated, field grounding types, merge fields, conditional sections, version management.' },
                    { name: 'Einstein Trust Layer Deep Dive', detail: 'PII masking patterns, toxicity detection thresholds, data residency options, audit trail in Event Monitoring.' },
                ]
            },
            {
                phase: 'Building Custom Agents', topics: [
                    { name: 'Flow Actions for Agents', detail: 'Auto-launched Flows as agent actions, input/output variable mapping, testing flows in agent context, error paths.' },
                    { name: 'Apex InvocableMethod for Agents', detail: '@InvocableMethod(label) setup, InvocableVariable for inputs/outputs, error handling, testing invocable methods.' },
                    { name: 'Human Escalation Protocols', detail: 'Designing handoff to human agent: escalation triggers, context passing, Omni-Channel routing from agent.' },
                    { name: 'Field & Object Grounding', detail: 'Grounding prompts with specific record fields, related object data, avoiding hallucination with grounded context.' },
                    { name: 'Agent Testing Strategies', detail: 'Golden question sets, edge case testing, adversarial prompts, boundary testing for topic classification.' },
                ]
            },
            {
                phase: 'Configuration & Security', topics: [
                    { name: 'Agent User License', detail: 'Agentforce user setup, agent running user permissions, what CRM data the agent can see, CRUD enforcement.' },
                    { name: 'Named Credentials for Agents', detail: 'External callouts from agent actions via Named Credentials, OAuth for external system authentication.' },
                    { name: 'Agent Monitoring Basics', detail: 'Session logs, conversation history in Setup, what gets logged, basic monitoring for deployed agents.' },
                    { name: 'Org-Wide AI Settings', detail: 'Einstein generative AI settings, opt-in for features, data sharing agreements, foundation model selection.' },
                    { name: 'Agent Versioning', detail: 'Draft vs active agent versions, promoting versions, rollback strategy, change tracking in Agent Builder.' },
                ]
            },
        ],
        advanced: [
            {
                phase: 'Developer Implementation', topics: [
                    { name: 'Custom Apex Actions Deep Dive', detail: 'Complex InvocableMethod patterns, List<> of inputs for bulkification, async actions, error surfacing to agent.' },
                    { name: 'Orchestration Flows for Agents', detail: 'Multi-step Orchestration Flows triggered by agents, stage/step design, parallel steps, decision routing.' },
                    { name: 'Data Cloud RAG Grounding', detail: 'Vector index on Data Cloud DMO, semantic search from agent, chunk size strategy, embedding model selection.' },
                    { name: 'External LLM Integration', detail: 'Model Connections setup, Azure OpenAI (GPT-4o) and AWS Bedrock (Claude) as foundation models, routing strategy.' },
                    { name: 'MuleSoft APIs as Agent Actions', detail: 'Exposing MuleSoft APIs as External Services in Salesforce, API catalog registration, action binding.' },
                ]
            },
            {
                phase: 'Advanced Architecture', topics: [
                    { name: 'Multi-Agent Orchestration', detail: 'Agent-to-agent delegation, parent/child agent patterns, context passing between agents, escalation chains.' },
                    { name: 'Memory Layers', detail: 'In-session memory (conversation context), persistent memory (CRM data), external memory (vector stores).' },
                    { name: 'Prompt Optimization', detail: 'Reducing token usage, few-shot vs zero-shot trade-offs, chain-of-thought for complex reasoning, output parsers.' },
                    { name: 'Bring-Your-Own LLM', detail: 'Custom Model connection, API schema mapping, streaming response handling, latency vs capability trade-offs.' },
                    { name: 'Agent as API Consumer', detail: 'Calling external REST APIs from agent actions, response parsing, error handling, rate limit management.' },
                ]
            },
            {
                phase: 'Deployment & Governance', topics: [
                    { name: 'Testing & Evaluation Framework', detail: 'Golden dataset creation, automated simulation API for regression testing, accuracy metrics, A/B agent testing.' },
                    { name: 'Event Monitoring for AI', detail: 'AgentforceSession events, prompt audit logs, usage analytics, cost tracking per agent interaction.' },
                    { name: 'Security & Compliance', detail: 'Data residency for AI (EU vs global), zero-retention mode, PII in prompts, GDPR implications for AI.' },
                    { name: 'Anomaly Detection', detail: 'Unusual usage patterns, topic drift detection, monitoring for prompt injection attempts, response quality degradation.' },
                    { name: 'CI/CD for Agentforce', detail: 'Deploying Agent configurations via Metadata API, source tracking for agent metadata, sandbox to production flow.' },
                ]
            },
        ],
    },
    fsc: {
        beginner: [
            {
                phase: 'FSC Platform Basics', topics: [
                    { name: 'What is Financial Services Cloud?', detail: 'FSC as an industry cloud on top of Sales/Service Cloud, licensing, pre-built objects and features, target verticals.' },
                    { name: 'Person Account Model', detail: 'Person Accounts vs Business Accounts, enabling Person Accounts, implications for record types and page layouts.' },
                    { name: 'Household Model Overview', detail: 'What is a Household (Account), adding members, primary member, household rollup of assets, referral tracking.' },
                    { name: 'Relationship Map', detail: 'Visual relationship map on Account/Person Account, adding relationships, relationship types (family/business).' },
                    { name: 'FSC Setup Wizard', detail: 'Guided setup for FSC: enabling features, assigning permission sets, configuring Financial Services Settings.' },
                ]
            },
            {
                phase: 'Core FSC Features', topics: [
                    { name: 'Financial Accounts', detail: 'FinancialAccount object: account number, type (checking/savings/investment), balance, status, linked to Individual.' },
                    { name: 'Assets & Liabilities', detail: 'AssetsAndLiabilities object: asset type, value, liabilities — tracking client net worth in the household.' },
                    { name: 'Interaction Summaries', detail: 'Logging meeting notes (InteractionSummary object), linking to accounts, timeline view, action items from meetings.' },
                    { name: 'Action Plans Basics', detail: 'Action Plan Templates (onboarding/annual review), creating an Action Plan from a template, task tracking.' },
                    { name: 'FSC Reports & Dashboards', detail: 'AUM by Advisor, Household Net Worth, Pipeline by Relationship, Client Activity reports.' },
                ]
            },
            {
                phase: 'Admin & Configuration', topics: [
                    { name: 'FSC Permission Sets', detail: 'Financial Services Cloud Standard, FSC Insurance, FSC Mortgage — assigning correctly per user role.' },
                    { name: 'Relationship Groups', detail: 'Creating Groups (households, businesses), Group Members with roles, group-level rollups.' },
                    { name: 'Referral Management', detail: 'Referral object, referral stages, tracking cross-sell/up-sell, referral score, compensation tracking.' },
                    { name: 'Document Tracking & Approvals', detail: 'Document Checklist Items on client records, DocuSign/Conga integration for e-signatures in FSC.' },
                    { name: 'Chatter for Client Teams', detail: 'Advisor collaboration, @mentioning specialists, Chatter groups for relationship teams, feed on Household.' },
                ]
            },
        ],
        intermediate: [
            {
                phase: 'FSC Data Model', topics: [
                    { name: 'FinancialAccount Object Deep Dive', detail: 'FinancialAccountRole (junction to Contact), Account Hierarchy, ownership types, joint accounts, beneficiaries.' },
                    { name: 'Financial Holdings', detail: 'FinancialHolding object: security/holding, quantity, value, linked to FinancialAccount — portfolio tracking.' },
                    { name: 'Revenue & AUM Tracking', detail: 'Revenue object, AUM calculation rollups, fee schedules linked to accounts, advisor book of business.' },
                    { name: 'Household Rollup Summaries', detail: 'Custom rollup triggers for financial account balances, net worth aggregation at household level.' },
                    { name: 'Person Account Automation', detail: 'Triggers on PersonAccount for financial onboarding, auto-creating related records on person account creation.' },
                ]
            },
            {
                phase: 'Industry Modules', topics: [
                    { name: 'Wealth Management', detail: 'Portfolio management objects, investment goals (FinancialGoal), asset allocation, advisor workspace components.' },
                    { name: 'Retail Banking', detail: 'Retail banking data model, loan origination (LoanApplicationFinancial), product catalog for banking products.' },
                    { name: 'Insurance Model', detail: 'InsurancePolicy, Claim, Coverage, InsurancePolicyCoverage junction — tracking policies and claims for clients.' },
                    { name: 'Mortgage & Lending', detail: 'ResidentialLoanApplication, MortgageApplication, LoanApplicationProperty — tracking loan pipeline.' },
                    { name: 'KYC & Compliance Objects', detail: 'Know Your Customer data model, compliance task tracking, regulatory fields on person accounts.' },
                ]
            },
            {
                phase: 'Automation & Developer', topics: [
                    { name: 'Apex for FSC Objects', detail: 'Before/after triggers on FinancialAccount, bulk processing financial holdings, Apex sharing for advisor teams.' },
                    { name: 'Flow for Client Onboarding', detail: 'Screen Flow for new client intake, creating Household + Person Account + Financial Accounts in one guided flow.' },
                    { name: 'Action Plan Apex Customization', detail: 'Creating Action Plans programmatically via Apex, custom task templates, conditional plan generation.' },
                    { name: 'FSC Einstein Features', detail: 'Einstein Relationship Insights, Next Best Action for advisors, AI-powered client recommendations.' },
                    { name: 'FSC Reports Advanced', detail: 'Custom Report Types for FSC (FinancialAccount with Roles, Households with Members), cross-object metrics.' },
                ]
            },
        ],
        advanced: [
            {
                phase: 'Developer Deep Dive', topics: [
                    { name: 'FSC Apex APIs & Rollup Patterns', detail: 'FinancialSummary rollups, custom rollup Apex triggers for balance aggregation, async rollup for large households.' },
                    { name: 'Omnistudio in FSC', detail: 'OmniScripts for loan origination, DataRaptors for FinancialAccount CRUD, FlexCards for advisor dashboard widgets.' },
                    { name: 'LWC for FSC', detail: 'Custom portfolio view LWC, net worth gauge component, relationship map extension with D3, @wire FSC APIs.' },
                    { name: 'Business Rules Engine (BRE)', detail: 'Decision tables for lending eligibility, BRE rule sets linked to loan applications, Apex integration with BRE.' },
                    { name: 'Performance in Large FSC Orgs', detail: 'LDV on FinancialAccount (millions of records), skinny tables for performance, Async Apex for bulk rollups.' },
                ]
            },
            {
                phase: 'Integration', topics: [
                    { name: 'FSC + Data Cloud', detail: 'Syncing FinancialAccount data to Data Cloud, unified client profiles with banking data, segment-driven advisor insights.' },
                    { name: 'Core Banking Integration', detail: 'Event-driven integration patterns (Platform Events) for real-time balance updates from core banking systems.' },
                    { name: 'Open Finance API Patterns', detail: 'PSD2/Open Banking API consumption, linking external account data to FSC FinancialAccount objects.' },
                    { name: 'Agentforce for FSC', detail: 'AI agent for advisor productivity: client summary agent, portfolio Q&A, meeting prep automation.' },
                    { name: 'Third-Party Data Enrichment', detail: 'Integrating Dun & Bradstreet, Equifax, credit bureau data with FSC objects via Apex callouts or MuleSoft.' },
                ]
            },
            {
                phase: 'Compliance & Governance', topics: [
                    { name: 'Regulatory Compliance Patterns', detail: 'Field Audit Trail on financial fields, data classification for PII, Shield Platform Encryption for sensitive data.' },
                    { name: 'Data Retention for Financial PII', detail: 'Retention policies for transaction data, archiving strategies, legal hold process, purge automation.' },
                    { name: 'SOC 2 & ISO Compliance in FSC', detail: 'Audit logging, access controls, change management, evidence collection for compliance reports.' },
                    { name: 'FINRA / SEC Considerations', detail: 'Communication archiving (Chatter/Email), supervision workflows, exam response processes in Salesforce.' },
                    { name: 'Multi-Advisor Access Patterns', detail: 'Sharing rules for advisor teams, territory-based sharing, manual share Apex for complex coverage models.' },
                ]
            },
        ],
    },
};

const RESET_PASSWORD = 'SHEIK@1234';

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function getTopics(cloudId, levelId) {
    return (DATA[cloudId][levelId] || []).flatMap(p => p.topics);
}
function totalTopics() {
    return Object.keys(DATA).reduce((s, c) =>
        s + Object.keys(DATA[c]).reduce((s2, l) =>
            s2 + getTopics(c, l).length, 0), 0);
}

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default class SfRoadmap extends LightningElement {
    @track isLoading = true;
    @track activeLevel = 'beginner';
    @track activeCloud = 'core';
    @track expandedKey = null;
    @track progress = {};          // { 'beginner-core': ['Topic A', ...] }
    @track showResetModal = false;
    @track resetPassword = '';
    @track resetError = '';
    @track showPassword = false;

    totalAll = totalTopics();

    // ── Lifecycle ─────────────────────────────────────
    connectedCallback() {
        loadProgress()
            .then(json => {
                try { this.progress = json ? JSON.parse(json) : {}; } catch (_) { this.progress = {}; }
            })
            .catch(() => { this.progress = {}; })
            .finally(() => { this.isLoading = false; });
    }

    // ── Persistence ───────────────────────────────────
    _save() {
        saveProgress({ progressJson: JSON.stringify(this.progress) }).catch(() => { });
    }

    // ── Progress helpers ──────────────────────────────
    _key() { return `${this.activeLevel}-${this.activeCloud}`; }
    _list() { return this.progress[this._key()] || []; }
    _isDone(n) { return this._list().includes(n); }
    _toggle(n) {
        const k = this._key(), l = this._list();
        this.progress = {
            ...this.progress,
            [k]: l.includes(n) ? l.filter(t => t !== n) : [...l, n],
        };
        this._save();
    }

    // ── Overall stats ─────────────────────────────────
    get doneAll() {
        return Object.values(this.progress).reduce((s, l) => s + l.length, 0);
    }
    get overallPct() {
        return Math.round((this.doneAll / this.totalAll) * 100);
    }
    get overallRingOffset() {
        const circ = 119.38;
        return +(circ * (1 - this.overallPct / 100)).toFixed(2);
    }

    // ── Active level helpers ──────────────────────────
    get _level() { return LEVELS.find(l => l.id === this.activeLevel) || LEVELS[0]; }
    get activeLevelColor() { return this._level.color; }
    get activeLevelEmoji() { return this._level.emoji; }
    get activeLevelLabel() { return this._level.label; }
    get levelDescription() {
        if (this.activeLevel === 'beginner') return 'Build your foundation. Focus on declarative tools, platform basics, and core Salesforce concepts before writing code.';
        if (this.activeLevel === 'intermediate') return 'Start building. Apex, LWC, integrations, and cloud-specific features. Time to get hands-on with real implementations.';
        return 'Think like an architect. Enterprise patterns, performance, DevOps, and AI-native Salesforce solutions at scale.';
    }
    get levelCardStyle() {
        const l = this._level;
        return `background:${l.bg}80; border:1px solid ${l.border};`;
    }
    get levelColorStyle() { return `color:${this.activeLevelColor};`; }

    // ── Active cloud helpers ──────────────────────────
    get _cloud() { return CLOUDS.find(c => c.id === this.activeCloud) || CLOUDS[0]; }
    get activeCloudIcon() { return this._cloud.icon; }
    get activeCloudName() { return this._cloud.name; }
    get activeCloudCert() { return this._cloud.cert; }
    get cloudHeaderStyle() {
        const c = this.activeLevelColor;
        return `background:linear-gradient(135deg,${c}14,${c}06); border:1px solid ${c}28;`;
    }
    get cloudIconStyle() {
        const c = this.activeLevelColor;
        return `background:linear-gradient(135deg,${c}40,${c}20); border:1px solid ${c}50; box-shadow:0 6px 20px ${c}20;`;
    }

    // ── Module progress ───────────────────────────────
    get moduleDone() { return this._list().length; }
    get moduleTotal() { return getTopics(this.activeCloud, this.activeLevel).length; }
    get modulePct() { return this.moduleTotal ? Math.round((this.moduleDone / this.moduleTotal) * 100) : 0; }
    get moduleRingOffset() {
        const circ = 150.8;
        return +(circ * (1 - this.modulePct / 100)).toFixed(2);
    }

    // ── Level tabs ────────────────────────────────────
    get levels() {
        return LEVELS.map(l => ({
            ...l,
            tabCls: `level-tab${this.activeLevel === l.id ? ' active-tab' : ''}`,
            tagCls: `level-tag${this.activeLevel === l.id ? ' active-tag' : ''}`,
            activeColor: this.activeLevel === l.id ? l.color : '#5a6a80',
        }));
    }

    // ── Cloud nav ─────────────────────────────────────
    get clouds() {
        const lv = this.activeLevel, ac = this.activeLevelColor;
        return CLOUDS.map(c => {
            const list = this.progress[`${lv}-${c.id}`] || [];
            const total = getTopics(c.id, lv).length;
            const pct = total ? Math.round((list.length / total) * 100) : 0;
            const isA = this.activeCloud === c.id;
            return {
                ...c,
                pct,
                navCls: `cloud-nav-btn${isA ? ' active-cloud' : ''}`,
                nameCls: `cloud-name-txt${isA ? ' active-name' : ''}`,
                pctCls: `cloud-pct${pct === 100 ? ' full-pct' : ''}`,
                barStyle: `width:${pct}%; background:${ac};`,
                bottomBarStyle: `width:${pct}%; background:${isA ? ac : ac + '60'};`,
                barTitle: `${c.name}: ${list.length}/${total}`,
            };
        });
    }

    // ── Phases & topics ───────────────────────────────
    get activePhases() {
        const phases = DATA[this.activeCloud][this.activeLevel];
        const c = this.activeLevelColor;
        return phases.map((ph, pi) => {
            const done = ph.topics.filter(t => this._isDone(t.name)).length;
            const total = ph.topics.length;
            const allDone = done === total;
            return {
                phaseKey: `phase-${pi}`,
                phase: ph.phase,
                phaseNum: `P${pi + 1}`,
                phaseDoneLabel: allDone ? '✓ Done' : `${done}/${total}`,
                phaseDoneCls: `phase-done-lbl${allDone ? ' phase-done-full' : ''}`,
                phaseBarStyle: `width:${Math.round((done / total) * 100)}%; background:${c};`,
                topics: ph.topics.map((t, ti) => {
                    const key = `${pi}-${ti}`;
                    const done_t = this._isDone(t.name);
                    const isExp = this.expandedKey === key;
                    return {
                        topicKey: key,
                        name: t.name,
                        detail: t.detail,
                        done: done_t,
                        expanded: isExp,
                        topicCls: `topic-item${done_t ? ' topic-done' : ''}${isExp ? ' topic-exp' : ''}`,
                        checkCls: `topic-check${done_t ? ' check-done' : ''}`,
                        nameCls: `topic-name${done_t ? ' name-done' : ''}${isExp ? ' name-exp' : ''}`,
                        arrowCls: `topic-arrow${isExp ? ' arrow-open' : ''}`,
                    };
                }),
            };
        });
    }

    get phaseHeaderStyle() {
        return `background:linear-gradient(90deg,${this.activeLevelColor}18,transparent); border-bottom:1px solid ${this.activeLevelColor}18;`;
    }
    get phaseBadgeStyle() {
        const c = this.activeLevelColor;
        return `background:${c}22; border:1px solid ${c}45; color:${c};`;
    }
    get topicDetailBorderStyle() {
        return `border-top:1px solid ${this.activeLevelColor}15;`;
    }

    // ── Study tips ────────────────────────────────────
    get studyTips() {
        const tips = [
            this.activeLevel === 'beginner' ? { title: 'Start Declarative', body: 'Master Flows, Validation Rules, and Reports before touching Apex. Trailhead Basics trail is your friend.' } : null,
            this.activeLevel === 'intermediate' ? { title: 'Build Real Things', body: 'For each topic, build a real implementation in a dev org — not just read. Muscle memory matters.' } : null,
            this.activeLevel === 'advanced' ? { title: 'Think Architecture', body: 'For every solution, consider: scalability, governor limits, maintainability, and upgrade safety.' } : null,
            { title: 'Trailhead Trails', body: 'Use Trailhead Trails for structured learning paths with hands-on challenges.' },
            { title: 'Superbadges', body: `Complete the ${this.activeLevel === 'beginner' ? 'CRM Basics' : this.activeLevel === 'intermediate' ? 'Apex Specialist' : 'Application Architect'} Superbadge to validate real skills.` },
            { title: 'Mock Exams', body: 'Use Focus on Force and Salesforce Ben practice exams. Target 85%+ before booking.' },
        ].filter(Boolean);
        return tips;
    }
    get tipBoxStyle() { return `border-left:3px solid ${this.activeLevelColor};`; }

    // ── Modal ─────────────────────────────────────────
    get passwordFieldType() { return this.showPassword ? 'text' : 'password'; }
    get modalInputCls() { return `modal-input${this.resetError ? ' input-error' : ''}`; }
    get modalConfirmCls() { return `modal-confirm-btn${this.resetPassword ? ' confirm-ready' : ''}`; }

    // ── Handlers ──────────────────────────────────────
    handleLevelChange(e) {
        this.activeLevel = e.currentTarget.dataset.id;
        this.expandedKey = null;
    }
    handleCloudChange(e) {
        this.activeCloud = e.currentTarget.dataset.id;
        this.expandedKey = null;
    }
    handleTopicExpand(e) {
        const k = e.currentTarget.dataset.key;
        this.expandedKey = this.expandedKey === k ? null : k;
    }
    handleTopicToggle(e) {
        e.stopPropagation();
        const k = e.currentTarget.dataset.key;
        const [pi, ti] = k.split('-').map(Number);
        const name = DATA[this.activeCloud][this.activeLevel][pi].topics[ti].name;
        this._toggle(name);
    }

    // ── Reset modal ───────────────────────────────────
    openResetModal() { this.showResetModal = true; this.resetPassword = ''; this.resetError = ''; }
    closeResetModal() { this.showResetModal = false; }
    togglePasswordVisibility() { this.showPassword = !this.showPassword; }
    handlePasswordChange(e) { this.resetPassword = e.target.value; this.resetError = ''; }
    handlePasswordKeydown(e) { if (e.key === 'Enter') this.confirmReset(); }

    confirmReset() {
        if (this.resetPassword !== RESET_PASSWORD) {
            this.resetError = 'Incorrect password. Access denied.';
            return;
        }
        this.progress = {};
        this.showResetModal = false;
        resetProgress().catch(() => { });
    }
}