import HeroSilboEditor from "./HeroSilboEditor.jsx";
import AboutEditor from "./AboutEditor.jsx";
import EdgeComputeEditor from "./EdgeComputeEditor.jsx";
import ProductRangeEditor from "./ProductRangeEditor.jsx";
import DeploymentsEditor from "./DeploymentsEditor.jsx";
import ApplicationsEditor from "./ApplicationsEditor.jsx";
import TechPartnersEditor from "./TechPartnersEditor.jsx";
import CtaBannerEditor from "./CtaBannerEditor.jsx";

export const SILBO_SECTION_EDITORS = {
	hero: HeroSilboEditor,
	about: AboutEditor,
	edgeCompute: EdgeComputeEditor,
	productRange: ProductRangeEditor,
	deployments: DeploymentsEditor,
	applications: ApplicationsEditor,
	techPartners: TechPartnersEditor,
	ctaBanner: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	about: "About",
	edgeCompute: "Edge Compute",
	productRange: "Product Range",
	deployments: "Deployments",
	applications: "Applications",
	techPartners: "Tech Partners",
	ctaBanner: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "about", "edgeCompute", "productRange", "deployments", "applications", "techPartners", "ctaBanner"];
