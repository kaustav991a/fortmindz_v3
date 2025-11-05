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
    <link rel="stylesheet" href="reset.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap.min.css" integrity="sha512-2bBQCjcnw658Lho4nlXJcc6WkV/UxpE/sAokbXPxQNGqmNdQrWqtw26Ns9kFF/yG792pKR1Sx8/Y1Lf1XN4GKA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css" rel="stylesheet">
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
                    <button class="menu-toggle" aria-expanded="false" aria-label="Toggle Menu">
                        <span></span><span></span><span></span>
                    </button>

                    <ul class="menu">
                        <li class="active"><a href="#">Home</a></li>

                        <li class="has-submenu">
                            <a href="#">About Us</a>
                            <!-- <ul class="submenu">
                                <li><a href="#">Our Story</a></li>
                                <li><a href="#">Team</a></li>
                                <li><a href="#">Careers</a></li>
                            </ul> -->
                        </li>

                        <li class="has-submenu">
                            <a href="#">Services</a>
                            <!-- <ul class="submenu">
                                <li><a href="#">Web Development</a></li>
                                <li><a href="#">App Design</a></li>
                                <li><a href="#">Consulting</a></li>
                            </ul> -->
                        </li>

                        <li><a href="#">Industries</a></li>
                        <li><a href="#">Case Studies</a></li>
                        <li><a href="#">Blogs</a></li>
                        <li><a href="#">Careers</a></li>
                    </ul>
                </nav>

                <div class="headbtn">
                    <a href="#!" class="btn has-icon">Contact Us <span><img src="images/arrow-long-right.png" alt=""></span></a>
                </div>
            </div>
        </div>
    </header>