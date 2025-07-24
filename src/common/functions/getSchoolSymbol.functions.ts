// example: [' 744[mosad:123456]', '123[mosad:33221]' ]
// example: [ '667[mosad:420208]', '178[mosad:490250]' ]
export const getSchoolSymbols = (orgrolecomplexParam: string[] | string) => {
    const mosadRegex = /(?:[\d]+)\[(?:mosad|[a-zA-Z&]+):([\d]+)\]/;
    const orgrolecomplexArr = Array.isArray(orgrolecomplexParam) ? orgrolecomplexParam : [orgrolecomplexParam];
    if (!orgrolecomplexArr.length) return [];
    const schoolSymbolArr = orgrolecomplexArr
        .map((orgrolecomplex) => orgrolecomplex.match(mosadRegex)?.[1])
        .filter((x) => !!x) as string[];
    return Array.from(new Set(schoolSymbolArr));
};
