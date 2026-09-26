import HeroCompanyEditor from "./HeroCompanyEditor.jsx";
import WhoWeAreEditor from "./WhoWeAreEditor.jsx";
import ValuesEditor from "./ValuesEditor.jsx";
import JourneyEditor from "./JourneyEditor.jsx";
import LeadershipEditor from "./LeadershipEditor.jsx";
import CtaBannerEditor from "../home/CtaBannerEditor.jsx";

export const COMPANY_SECTION_EDITORS = {
	hero: HeroCompanyEditor,
	whoWeAre: WhoWeAreEditor,
	values: ValuesEditor,
	journey: JourneyEditor,
	leadership: LeadershipEditor,
	ctaBanner: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	whoWeAre: "Who We Are",
	values: "Our Values",
	journey: "Our Journey",
	leadership: "Leadership",
	ctaBanner: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "whoWeAre", "values", "journey", "leadership", "ctaBanner"];
