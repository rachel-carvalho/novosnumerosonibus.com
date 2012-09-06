/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  MainViewController.h
//  NovosNumerosOnibus
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "MainViewController.h"

NSString *const ADMOB_ID = @"a15043db386e695";
int const MAX_IAD_ATTEMPTS = 0;

@interface MainViewController ()

@property BOOL isLandscape;
@property int iadAttempts;
@property BOOL isAdMobActive;

- (void) updateViewAd: (UIView *) ad;
- (void) updateViewAd: (UIView *) ad init: (BOOL) init;
@end

@implementation MainViewController {
    GADBannerView *admobBanner;
    ADBannerView *iadBanner;
}

- (id) initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        
    }
    return self;
}

- (void) didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

- (void) viewDidLoad
{
    [super viewDidLoad];
    self.isLandscape = UIInterfaceOrientationIsLandscape(self.interfaceOrientation);
    self.isAdMobActive = NO;
    self.iadAttempts = 0;

    // admob
    admobBanner = [[GADBannerView alloc] initWithAdSize: kGADAdSizeSmartBannerPortrait];
    admobBanner.adUnitID = ADMOB_ID;

    admobBanner.rootViewController = self;
    admobBanner.delegate = self;
    admobBanner.backgroundColor = [UIColor colorWithWhite:0 alpha:0];
    
    [self updateViewAd: admobBanner init: YES];
    [self.view addSubview: admobBanner];

    // iad
    iadBanner = [[ADBannerView alloc] init];
    iadBanner.delegate = self;
    iadBanner.currentContentSizeIdentifier = self.isLandscape ? ADBannerContentSizeIdentifierLandscape : ADBannerContentSizeIdentifierPortrait;
    [self updateViewAd: iadBanner init: YES];
    [self.view addSubview: iadBanner];
}

// iAd delegate
- (void)bannerViewDidLoadAd:(ADBannerView *)banner
{
    NSLog(@"[iad] ad loaded, %d", banner.isBannerLoaded);

    if(banner.isBannerLoaded)
        self.iadAttempts = 0;

    [self updateViewAd: banner.isBannerLoaded ? banner : nil];
}

- (void)bannerView:(ADBannerView *)banner didFailToReceiveAdWithError:(NSError *)error
{
    self.iadAttempts++;
    NSLog(@"[iad] ad not loaded (%d times)", self.iadAttempts);

    if(self.iadAttempts > MAX_IAD_ATTEMPTS){
        
        self.isAdMobActive = YES;
        // removing iad banner
        [iadBanner removeFromSuperview];
        iadBanner.delegate = nil;
        [iadBanner release];
        iadBanner = nil;

        [admobBanner loadRequest: [GADRequest request]];
    }
}

- (void) bannerViewActionDidFinish:(ADBannerView *)banner
{
    banner.currentContentSizeIdentifier = self.isLandscape ? ADBannerContentSizeIdentifierLandscape : ADBannerContentSizeIdentifierPortrait;

    [self updateViewAd: banner];
}

// AdMob delegate
- (void) adViewDidReceiveAd:(GADBannerView *)view
{
    NSLog(@"[admob] new ad");
    [self updateViewAd: view];
}

- (void) adView:(GADBannerView *)view didFailToReceiveAdWithError:(GADRequestError *)error
{
    [self updateViewAd: view init: YES];
}

- (void) updateViewAd:(UIView *)ad
{
    [self updateViewAd:ad init: NO];
}

- (void) updateViewAd:(UIView *)ad init:(BOOL)init
{
    CGSize screen = self.view.frame.size;
    CGSize banner = ad.frame.size;

    NSLog(@"update ad pos: %@, %fx%f", [ad class], banner.width, banner.height);

    if(!ad)
        ad = self.isAdMobActive ? admobBanner : iadBanner;

    if(!ad || init)
        banner = CGSizeMake(0, 0);

    if(self.isLandscape)
        screen = CGSizeMake(screen.height, screen.width);

    self.webView.frame = CGRectMake(0, 0, screen.width, screen.height - banner.height);
    CGRect adFrame = ad.frame;
    adFrame.origin.y = self.webView.frame.size.height;
    ad.frame = adFrame;
}

- (void) willAnimateRotationToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    BOOL goingToLandscape = UIInterfaceOrientationIsLandscape(toInterfaceOrientation);

    if(self.isLandscape != goingToLandscape){
        NSLog(@"changed orientation");
        self.isLandscape = goingToLandscape;

        admobBanner.adSize = goingToLandscape ? kGADAdSizeSmartBannerLandscape : kGADAdSizeSmartBannerPortrait;
        if(self.isAdMobActive)
            [admobBanner loadRequest: [GADRequest request]];
        
        iadBanner.currentContentSizeIdentifier = goingToLandscape ? ADBannerContentSizeIdentifierLandscape : ADBannerContentSizeIdentifierPortrait;

        UIView *banner = nil;
        if(!self.isAdMobActive && iadBanner.isBannerLoaded)
            banner = iadBanner;
        else if (self.isAdMobActive && !admobBanner.hidden)
            banner = admobBanner;

        [self updateViewAd: banner];
    }
}

- (void) viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL) shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

- (void)dealloc {
    [iadBanner release];
    [admobBanner release];
    [super dealloc];
}

/* Comment out the block below to over-ride */
/*
- (CDVCordovaView*) newCordovaViewWithFrame:(CGRect)bounds
{
    return[super newCordovaViewWithFrame:bounds];
}
*/

/* Comment out the block below to over-ride */
/*
#pragma CDVCommandDelegate implementation

- (id) getCommandInstance:(NSString*)className
{
	return [super getCommandInstance:className];
}

- (BOOL) execute:(CDVInvokedUrlCommand*)command
{
	return [super execute:command];
}

- (NSString*) pathForResource:(NSString*)resourcepath;
{
	return [super pathForResource:resourcepath];
}
 
- (void) registerPlugin:(CDVPlugin*)plugin withClassName:(NSString*)className
{
    return [super registerPlugin:plugin withClassName:className];
}
*/

#pragma UIWebDelegate implementation

- (void) webViewDidFinishLoad:(UIWebView*) theWebView 
{
     // only valid if ___PROJECTNAME__-Info.plist specifies a protocol to handle
     if (self.invokeString)
     {
        // this is passed before the deviceready event is fired, so you can access it in js when you receive deviceready
		NSLog(@"DEPRECATED: window.invokeString - use the window.handleOpenURL(url) function instead, which is always called when the app is launched through a custom scheme url.");
        NSString* jsString = [NSString stringWithFormat:@"var invokeString = \"%@\";", self.invokeString];
        [theWebView stringByEvaluatingJavaScriptFromString:jsString];
     }
     
     // Black base color for background matches the native apps
     theWebView.backgroundColor = [UIColor blackColor];

	return [super webViewDidFinishLoad:theWebView];
}

/* Comment out the block below to over-ride */
/*

- (void) webViewDidStartLoad:(UIWebView*)theWebView 
{
	return [super webViewDidStartLoad:theWebView];
}

- (void) webView:(UIWebView*)theWebView didFailLoadWithError:(NSError*)error 
{
	return [super webView:theWebView didFailLoadWithError:error];
}

- (BOOL) webView:(UIWebView*)theWebView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
	return [super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType];
}
*/

@end
