import { Injectable } from '@angular/core';
import { v4 } from 'uuid';
import { FileElement } from '../../file-explorer/model/element';
import { Observable, BehaviorSubject } from 'rxjs';

export interface IFileService {
  addProjectFolder(fileElement: FileElement);
  deleteProjectFolder(id: string);
  updateProjectFolder(id: string, update: Partial<FileElement>);

  addDomainFolder(fileElement: FileElement);
  deleteDomainFolder(id: string);
  updateDomainFolder(id: string, update: Partial<FileElement>);

  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable()
export class FileService implements IFileService {

  private map = new Map<string, FileElement>();
  private querySubject: BehaviorSubject<FileElement[]>;

  constructor() {}

  addProjectFolder(fileElement: FileElement) {
    fileElement.id = v4();
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  deleteProjectFolder(id: string) {
    this.map.delete(id);
  }

  updateProjectFolder(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
  }

  addDomainFolder(fileElement: FileElement) {
    fileElement.id = v4();
    this.map.set(fileElement.id, this.clone(fileElement));
    return fileElement;
  }

  deleteDomainFolder(id: string) {
    this.map.delete(id);
  }

  updateDomainFolder(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
  }

  queryInFolder(folderId: string) {
    const result: FileElement[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }

  clearProjectsMapElement() {
    this.map = new Map<string, FileElement>();
  }

  clearDomainsMapElement() {
    this.map = new Map<string, FileElement>();
  }
}
