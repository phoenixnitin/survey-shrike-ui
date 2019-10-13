import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  surveyDataPreTraining = {
    'attend': null,
    'attend-reason': null,
    'event-reason': null,
    'topic': null
  };
  displayName: string = '';
  userEmail: string = '';
  userCurrentPass: string = '';
  userRepeatPass: string = '';
  constructor() { }
}
