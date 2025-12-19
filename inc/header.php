<!DOCTYPE html>
<html lang="en">

<head>
    <!-- ✅ Basic Meta -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="description" content="Your site description goes here." />

    <!-- ✅ Page Title -->
    <title>Fortmindz</title>

    <!-- ✅ Favicon -->
    <link rel="icon" href="favicon.png" type="image/x-icon" />

    <!-- ✅ CSS Reset & Styles -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap.min.css" integrity="sha512-2bBQCjcnw658Lho4nlXJcc6WkV/UxpE/sAokbXPxQNGqmNdQrWqtw26Ns9kFF/yG792pKR1Sx8/Y1Lf1XN4GKA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
    <link href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" integrity="sha512-1cK78a1o+ht2JcaW6g8OXYwqpev9+6GqOkz9xmBN9iUUhIndKtxwILGWYOSibOKjLsEdjyjZvYDq/cZwNeak0w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.4/build/css/intlTelInput.css">
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/responsive.css" />
    <!-- ✅ Theme Color for Mobile -->
    <meta name="theme-color" content="#ffffff" />
</head>

<body>

    <header>
        <div class="container">
            <div class="header-row">
                <div class="logo">
                    <a href="index.php">
                        <img src="images/logo.png" alt="">
                    </a>
                </div>

                <nav class="nav">
                    <ul class="menu">
                        <li class="active"><a href="#">Home</a></li>

                        <li class="has-megamenu mobile-submenu">
                            <a href="#">About Us <span class="mobile-arrow"></span> <!-- Added for mobile --></a>
                            <div class="megamenu">
                                <div class="row">
                                    <div class=" col-lg-8">
                                        <div class="mega-left">
                                            <div class="mega-head-panel">
                                                <h5>About Us</h5>
                                            </div>
                                            <ul class="circle-icon-arrow">
                                                <li class="each-panel"><a href="#"><h6><span class="c-icon"><img src="images/mega-icon1.png" alt=""></span>Profile</h6><span class="arrow-circle-icon"><img src="images/arrow-right-black.png" alt="icon"></span></a></li>
                                                <li class="each-panel"><a href="#"><h6><span class="c-icon"><img src="images/mega-icon2.png" alt=""></span>Our Team</h6><span class="arrow-circle-icon"><img src="images/arrow-right-black.png" alt="icon"></span></a></li>
                                                <li class="each-panel"><a href="#"><h6><span class="c-icon"><img src="images/mega-icon3.png" alt=""></span>Life at Fortmindz</h6><span class="arrow-circle-icon"><img src="images/arrow-right-black.png" alt="icon"></span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-lg-4">
                                        <div class="mega-right">
                                            <div class="mega-head-panel">
                                                <h5>Featured Insight</h5>
                                            </div>
                                            <div class="mega-f-bg">
                                                <div class="mega-feature">
                                                    <img src="images/feat-insight-img1.png" alt="Featured">
                                                    <div class="mega-text">
                                                        <h6>Fortmindz Recognized for Excellence in Digital Product Engineering 2024</h6>
                                                        <p>Our rapid prototyping and engineering-led delivery model continues to earn global recognition.</p>
                                                        <a href="#!" class="readmore">Read Full Article</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li class="menu-item has-megamenu mobile-submenu">
                            <a href="#">Services <span class="mobile-arrow"></span> <!-- Added for mobile --></a>
                            <div class="megamenu services-megamenu">
                                <div class="mega-content">
                                    <div class="mega-column ">
                                        <div class="mega-group">
                                            <div class="mega-head-panel">
                                                <h5>DESIGN & PRODUCT</h5>
                                            </div>
                                            <ul class="mega-icon-links-txt">
                                                <li>
                                                    <a href="services-uiux.php">
                                                        <span class="normal-icon"><img src="images/s-icon1.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>UiUX Development</h6>
                                                            <p>User-centered designs for better engagement.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="services-mobile-app-dev.php">
                                                        <span class="normal-icon"><img src="images/s-icon2.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>MVP Development</h6>
                                                            <p>Rapid MVPs to validate ideas.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="mega-group">
                                            <div class="mega-head-panel">
                                                <h5>ENGINEERING & DEVELOPMENT</h5>
                                            </div>
                                            <ul class="mega-icon-links-txt">
                                                <li>
                                                    <a href="services-web-app-devlopment.php">
                                                        <span class="normal-icon"><img src="images/s-icon3.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Web Application Development</h6>
                                                            <p>User-centered designs for better engagement.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                                 <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/s-icon4.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Mobile App Development</h6>
                                                            <p>Innovative iOS & Android apps.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="service-testing-qa.php">
                                                        <span class="normal-icon"><img src="images/s-icon5.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>API Development</h6>
                                                            <p>Modular APIs for seamless integration.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="service-testing-qa.php">
                                                        <span class="normal-icon"><img src="images/s-icon6.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Custom Software Development</h6>
                                                            <p>Tailored solutions for your business.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="mega-group">
                                            <div class="mega-head-panel">
                                                <h5>SPECIALIZED SERVICES</h5>
                                            </div>
                                            <ul class="mega-icon-links-txt">
                                                <li>
                                                    <a href="services-web-app-devlopment.php">
                                                        <span class="normal-icon"><img src="images/s-icon7.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Dedicated Development Team</h6>
                                                            <p>Scalable expert teams for your project.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/s-icon8.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Testing & QA</h6>
                                                            <p>Thorough testing for flawless software.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="service-testing-qa.php">
                                                        <span class="normal-icon"><img src="images/s-icon9.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>E-Commerce Solutions</h6>
                                                            <p>Growth-driven e-commerce platforms.</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mega-column w490">
                                        <div class="mega-other-bx">
                                            <div class="mega-head-panel">
                                                <h5>CTA</h5>
                                            </div>
                                            <div class="mega-content-gp">
                                                <div class="mega-dts">
                                                    <h4>Didn’t find what you were looking for?</h4>
                                                    <h6>Tell us your requirements and we’ll create a solution tailored to you.</h6>
                                                </div>
                                                <a href="#!" class="btn has-icon">Schedule a Free Consultation <span><img src="images/arrow-long-right.png" alt=""></span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="menu-item has-megamenu mobile-submenu">
                            <a href="#">Industries <span class="mobile-arrow"></span></a>
                            <div class="megamenu services-megamenu">
                                <div class="mega-content">
                                    <div class="mega-column ">
                                        <div class="mega-group">
                                            <div class="mega-head-panel">
                                                <h5>Industries</h5>
                                            </div>
                                            <ul class="mega-orange-icon-txt">
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon1.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Health Care</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon2.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Travel & Touris</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon3.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Education & eLearning</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon4.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Real Estate Industry</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon5.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Ecommerce & Retail</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon6.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Start up - SMBs Industry</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon7.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Fintech & Banking</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#?">
                                                        <span class="normal-icon"><img src="images/in-icon8.png" alt="icon-s"></span>
                                                        <div class="mega-rig-grp">
                                                            <h6>Logistics Industry</h6>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mega-column w490">
                                        <div class="mega-other-bx">
                                            <div class="mega-head-panel">
                                                <h5>CTA</h5>
                                            </div>
                                            <div class="mega-content-gp">
                                                <div class="mega-dts">
                                                    <h4>Didn’t find what you were looking for?</h4>
                                                    <h6>Tell us your requirements and we’ll create a solution tailored to you.</h6>
                                                </div>
                                                <a href="#!" class="btn has-icon">Schedule a Free Consultation <span><img src="images/arrow-long-right.png" alt=""></span></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li><a href="#">Case Studies</a></li>
                        <li><a href="#">Blogs</a></li>
                        <li><a href="#">Careers</a></li>
                    </ul>
                </nav>

                <div class="menutext">
                    <span>Menu</span>
                    <button class="menu-toggle" aria-expanded="false" aria-label="Toggle Menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>

                <div class="headbtn">
                    <a href="#!" class="btn has-icon">Contact Us <span><img src="images/arrow-long-right.png" alt=""></span></a>
                </div>
            </div>
        </div>
    </header>