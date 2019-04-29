import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomainsDataService {

  domains: any;
  domainsSource: BehaviorSubject<any>;
  newDomain: any;

  constructor() {
    this.domains = sessionStorage.getItem('domains_json');
    if (this.domains !== null && this.domains !== '') {
      const domains_string_arr = this.domains.split('*');
      this.domains = this.convertToArrayOfObject(domains_string_arr);
    }
    this.domainsSource = new BehaviorSubject(this.domains);
    this.newDomain = this.domainsSource.asObservable();
  }

  changeDomain(domains: any) {
    this.domainsSource.next(domains);
  }

  convertToArrayOfObject(domains: any) {
    domains.forEach(function (value: any, index: number) {
      domains[index] = JSON.parse(value);
    });
    return domains;
  }

  convertToArrayOfString(domains: any) {
    domains.forEach(function (value: any, index: number) {
      domains[index] = JSON.stringify(value);
    });
    return domains;
  }
}
