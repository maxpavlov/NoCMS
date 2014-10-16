/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.addTemplates("default", {
    imagesPath: CKEDITOR.getUrl(CKEDITOR.plugins.getPath("templates") + "templates/images/"), templates:
    [
        {
            title: "Strip indicator", image: "template1.gif", description: "Tricolor strip indicator",
            html: '<div class="indicator" style="width: 300px; margin: 0 auto; float: none;">' +
                '<div class="light-gray" style="width: 67%;">' +
                '<div class="dark-gray" style="width: 50%;"></div>' +
                '</div>' +
                '</div>' +
                '<div class="clear"></div>'
        },
        {
            title: "Photo", image: "template1.gif", description: "Photo",
            html: '<div style="width: 300px; margin: 0 auto; float: none;height: 300px;overflow:hidden;border-radius: 50px; border: 5px solid black;">' +
                '<p> text </p>' +
                
                '</div>' +
                '<div class="clear"></div>'
        },
        {
            title: "Background with dots", image: "template1.gif", description: "Photo",
            html: '<div id="dotted-bg-block">' +
                '<p> content </p>' +

                '</div>' +
                '<div class="clear"></div>'
        },
        {
            title: "Container with frame", image: "template1.gif", description: "Photo",
            html: '<div id="container-with-border">' +
                '<p> content </p>' +

                '</div>' +
                '<div class="clear"></div>'
        },
        {
            title: "Three person", image: "template1.gif", description: "Template for three persons",
            html: '<div id="three-person-container">' +
                '<div class="person">' +
                '<img src="/assets/global/img/top-background.png" />' +
                '<div class="name-age">' +
                    '<p class="person-name"><span class="first-name">FName </span><span class="last-name"> LName</span></p>' +
                    '<p class="person-age">25</p>' +
                '</div>' +
                
               '<p class="person-position">person position</p>' +
                '<p class="person-description">About person</p>' +

                '<div class="person-photo-container ppc1">' +
                '<div class="person-photo">' +
                '<p></p>' +
                '<div class="person-photo-overlay"></div>' +
                '</div>' +
                '' +
                '</div>' +
                '<div class="person-dotted-bg"> </div>' +
                '<div class="clear"></div>' +
            '</div>' +
            
           '<div class="person">' +
                '<img src="/assets/global/img/top-background.png" />' +
                '<div class="name-age">' +
                    '<p class="person-name"><span class="first-name">FName </span><span class="last-name"> LName</span></p>' +
                    '<p class="person-age">25</p>' +
                '</div>' +
                
                '<p class="person-position">person position</p>' +
                '<p class="person-description">About person</p>' +

                '<div class="person-photo-container ppc2">' +
                '<div class="person-photo">' +
                '<p></p>' +
                '<div class="person-photo-overlay"></div>' +
                '</div>' +
                '' +
                '</div>' +
                '<div class="person-dotted-bg"> </div>' +
                '<div class="clear"></div>' +
            '</div>' +
            
            '<div class="person" style="margin-right: 0;">' +
                '<img src="/assets/global/img/top-background.png" />' +
                '<div class="name-age">' +
                    '<p class="person-name"><span class="first-name">FName </span><span class="last-name"> LName</span></p>' +
                    '<p class="person-age">25</p>' +
                '</div>' +
                
                '<p class="person-position">person position</p>' +
                '<p class="person-description">About person</p>' +

                '<div class="person-photo-container ppc3">' +
                '<div class="person-photo">' +
                '<p></p>' +
                '<div class="person-photo-overlay"></div>' +
                '</div>' +
                '' +
                '</div>' +
                '<div class="person-dotted-bg"> </div>' +
                '<div class="clear"></div>' +
            '</div>' +
                '<div class="person-line"> </div>' +
       ' </div>' +
                '</div>' +
                '<p> next </p>'
                
        },
        {
            title: "Two person", image: "template1.gif", description: "Template for two persons",
            html: '<div id="two-person-container">' +
                '<div class="person">' +
                '<img src="/assets/global/img/top-background.png" />' +
                '<div class="name-age">' +
                    '<p class="person-name"><span class="first-name">FName </span><span class="last-name"> LName</span></p>' +
                    '<p class="person-age">25</p>' +
                '</div>' +

               '<p class="person-position">person position</p>' +
                '<p class="person-description">About person</p>' +

                '<div class="person-photo-container ppc1">' +
                '<div class="person-photo">' +
                '<p></p>' +
                '<div class="person-photo-overlay"></div>' +
                '</div>' +
                '' +
                '</div>' +
                '<div class="person-dotted-bg"> </div>' +
                '<div class="clear"></div>' +
            '</div>' +

           '<div class="person">' +
                '<img src="/assets/global/img/top-background.png" />' +
                '<div class="name-age">' +
                    '<p class="person-name"><span class="first-name">FName </span><span class="last-name"> LName</span></p>' +
                    '<p class="person-age">25</p>' +
                '</div>' +

                '<p class="person-position">person position</p>' +
                '<p class="person-description">About person</p>' +

                '<div class="person-photo-container ppc2">' +
                '<div class="person-photo">' +
                '<p></p>' +
                '<div class="person-photo-overlay"></div>' +
                '</div>' +
                '' +
                '</div>' +
                '<div class="person-dotted-bg"> </div>' +
                '<div class="clear"></div>' +
            '</div>' +

                '</div>' +
                '<p> next </p>'

        },
        {
            title: "Contacts. two addresses", image: "template1.gif", description: "Page 'Contact' - two addresses in a row",
            html: '<div id="two-contacts">' +
                    '<div class="contacts-item" itemscope itemtype="http://schema.org/LocalBusiness">' +
                '<div class="contact-separator">' +
                '<div class="aside-circle c-left"></div>' +
                '<div class="aside-circle c-right"></div>' +
                '<div class="slim-line"></div>' +
                '<div class="fat-line"></div>' +
                '</div>' +
                '<p class="office-title" itemprop="name"><span>HEAD </span><span class="highlighted">OFFICE</span></p>' +
                '<div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">' +
                '<p class="address"><span>1-844 bleen</span><br /><span itemprop="streetAddress">New York Central Square 24</span><br /><span itemprop="email">info@bleen.com</span></p>' +
                '<p class="tel" itemprop="telephone"><span class="highlighted">01 </span><span>254 65 78</span></p>' +
                '</div>' +
                '<div class="indicator">' +
                '<div class="light-gray" style="width: 67%;">' +
                '<div class="dark-gray" style="width: 50%;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<div class="contacts-item" itemscope itemtype="http://schema.org/LocalBusiness">' +
                '<div class="contact-separator">' +
                '<div class="aside-circle c-left"></div>' +
                '<div class="aside-circle c-right"></div>' +
                '<div class="slim-line"></div>' +
                '<div class="fat-line"></div>' +
                '</div>' +
                '<p class="office-title" itemprop="name"><span>HEAD </span><span class="highlighted">OFFICE</span></p>' +
                '<div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">' +
                '<p class="address"><span>1-844 bleen</span><br /><span itemprop="streetAddress">New York Central Square 24</span><br /><span itemprop="email">info@bleen.com</span></p>' +
                '<p class="tel" itemprop="telephone"><span class="highlighted">01 </span><span>254 65 78</span></p>' +
                '</div>' +
                '<div class="indicator">' +
                '<div class="light-gray" style="width: 67%;">' +
                '<div class="dark-gray" style="width: 50%;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
        
                '<div class="clear"></div>' +
                '</div>'
        },
        {
            title: "Contacts. One address", image: "template1.gif", description: "Page 'Contact' - one adress in row",
            html: '<div id="one-contacts">' +
                    '<div class="contacts-item" itemscope itemtype="http://schema.org/LocalBusiness">' +
                '<div class="contact-separator">' +
                '<div class="aside-circle c-left"></div>' +
                '<div class="aside-circle c-right"></div>' +
                '<div class="slim-line"></div>' +
                '<div class="fat-line"></div>' +
                '</div>' +
                '<p class="office-title" itemprop="name"><span>HEAD </span><span class="highlighted">OFFICE</span></p>' +
                '<div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">' +
                '<p class="address"><span>1-844 bleen</span><br /><span itemprop="streetAddress">New York Central Square 24</span><br /><span itemprop="email">info@bleen.com</span></p>' +
                '<p class="tel" itemprop="telephone"><span class="highlighted">01 </span><span>254 65 78</span></p>' +
                '</div>' +
                '<div class="indicator">' +
                '<div class="light-gray" style="width: 67%;">' +
                '<div class="dark-gray" style="width: 50%;"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<div class="clear"></div>' +
                '</div>'
        }
    ]
});