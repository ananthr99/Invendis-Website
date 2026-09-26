import HeroResourcesEditor from "./HeroResourcesEditor.jsx";
import ArticlesEditor from "./ArticlesEditor.jsx";
import CtaBannerEditor from "../home/CtaBannerEditor.jsx";

export const RESOURCES_SECTION_EDITORS = {
	hero: HeroResourcesEditor,
	articles: ArticlesEditor,
	ctaBanner: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	articles: "Articles",
	ctaBanner: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "articles", "ctaBanner"];
