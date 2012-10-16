/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"ARS7IRxgvonteXWB0KsEc9f2UxavWPWR"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"TwS1XVHH18NaYf59CYZRIvno6iBz7LUN"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"5Hxh5lcOiZGusRD1eXgtEQigX2PHwDlc"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"Xy4V0oiHoFfjNnRJon8LQqsTiigFvBpr"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"NGMNTLbRkRYnTMxJCt4WwpZ2Fvz9LhbV"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"eDNFkPOje9pH5DF7teFvAsIJMhbxNIfS"] forKey:@"acs-api-key-production"];

    return _property;
}
@end
