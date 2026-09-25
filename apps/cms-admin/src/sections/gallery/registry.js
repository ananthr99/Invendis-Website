import HeroGalleryEditor from "./HeroGalleryEditor.jsx";
import PhotoGalleryEditor from "./PhotoGalleryEditor.jsx";
import CtaBannerEditor from "../home/CtaBannerEditor.jsx";

export const GALLERY_SECTION_EDITORS = {
	hero: HeroGalleryEditor,
	photoGallery: PhotoGalleryEditor,
	ctaBanner: CtaBannerEditor,
};

export const SECTION_LABELS = {
	hero: "Hero",
	photoGallery: "Photo Gallery",
	ctaBanner: "CTA Banner",
};

export const ALL_SECTION_KEYS = ["hero", "photoGallery", "ctaBanner"];
