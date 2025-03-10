const router = require("express").Router();
const { HomePage,CategoryPage, ProductPage, AboutPage,GalleryPage,BlogPage,VideoPage,ServicePage,ContactPage, LoginPage, SignupPage, AddBlogsPage } = require("./../Controller/ViewController");
const { isAdminLoggedIn, isLoggedIn } = require("./../Controller/AuthController")

router.get("/Home", HomePage);
router.get("/", HomePage);
router.get("/category",CategoryPage);
router.get("/products",ProductPage);
router.get("/about", AboutPage);
router.get("/gallery", GalleryPage);
router.get("/blog", BlogPage);
router.get("/videos", VideoPage);
router.get("/service", ServicePage);
router.get("/contact",ContactPage);
router.get("/login", LoginPage)
router.delete("/logout", LoginPage)
router.get("/signup", SignupPage)
router.get("/add-blogs", isLoggedIn, AddBlogsPage);


module.exports = router;