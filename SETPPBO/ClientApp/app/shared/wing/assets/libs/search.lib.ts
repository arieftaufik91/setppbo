export class SearchLib {
    searchArray(array: any[], keyword: string): any[] {
        if (keyword === undefined) { keyword = ''; }
        return array.filter(r =>
            JSON.stringify(r).toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        );
    }
}
