import HeroContactEditor from "./HeroContactEditor.jsx";
import ContactBodyEditor from "./ContactBodyEditor.jsx";
import GlobalPresenceEditor from "./GlobalPresenceEditor.jsx";

export const CONTACT_SECTION_EDITORS = {
	hero: HeroContactEditor,
	contactBody: ContactBodyEditor,
	globalPresence: GlobalPresenceEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	contactBody: "Contact Info & Form",
	globalPresence: "Global Presence",
};

export const ALL_SECTION_KEYS = ["hero", "contactBody", "globalPresence"];
