#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"tismsview",@"name",@"ti.smsview",@"moduleid",@"1.1",@"version",@"BD054D6A-22A1-4B4E-8BE2-143C51A0C511",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end
