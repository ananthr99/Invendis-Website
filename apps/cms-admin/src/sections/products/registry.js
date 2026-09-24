import HeroProductEditor from "./HeroProductEditor.jsx";
import HardwarePortfolioEditor from "./HardwarePortfolioEditor.jsx";
import SilboProductsEditor from "./SilboProductsEditor.jsx";
import SoftwarePlatformsEditor from "./SoftwarePlatformsEditor.jsx";
import DesignPartnersEditor from "./DesignPartnersEditor.jsx";
import CtaBannerEditor from "../home/CtaBannerEditor.jsx";

export const PRODUCT_SECTION_EDITORS = {
	hero: HeroProductEditor,
	hardwarePortfolio: HardwarePortfolioEditor,
	silboProducts: SilboProductsEditor,
	softwarePlatforms: SoftwarePlatformsEditor,
	designPartners: DesignPartnersEditor,
	cta: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	hardwarePortfolio: "Hardware Portfolio",
	silboProducts: "SILBO Products",
	softwarePlatforms: "Software Platforms",
	designPartners: "Design Partners",
	cta: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "hardwarePortfolio", "silboProducts", "softwarePlatforms", "designPartners", "cta"];
