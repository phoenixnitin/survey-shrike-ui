import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  surveyDataPreTraining = {
    email: '',
    attend: 'yes',
    attendReason: '',
    eventReason: '',
    topic: ''
  };
  surveyDataPostTraining = {
    email: '',
    name: '',
    training: '',
    satisfiedLevel: '5',
    quality: '',
    attendBefore: 'no',
    attendReasonPost: '',
    recommend: 'yes',
    comments: ''
  };
  displayName: string = '';
  userEmail: string = '';
  userCurrentPass: string = '';
  userRepeatPass: string = '';
  protocol = "https://";
  server = 'survey-shrike-spring.cfapps.io';
  serverPort = '443';
  preTrainingRecordExistCheck;
  postTrainingRecordExistCheck;
  preBtnDisabled = false;
  postBtnDisabled = false;
  headers = {
    'Access-Control-Allow-Origin': '*'
  };
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  preTrainingCreate() {
    this.preBtnDisabled = true;
    this.http.post(this.protocol + this.server + ":" + this.serverPort + "/pretraining/create", this.surveyDataPreTraining, {headers: this.headers}).subscribe(
      success => {
        this.preTrainingRecordExistCheck = true;
        this.toastr.success("Pre Training feedback submitted successfully.");
        this.preBtnDisabled = false;
      },
      failed => {
        this.preTrainingRecordExistCheck = false;
        this.toastr.error("Error occurred. Cannot submit now. Try again later.");
        this.preBtnDisabled = false;
      }
    )
  }

  postTrainingCreate() {
    this.postBtnDisabled = true;
    this.http.post(this.protocol + this.server + ":" + this.serverPort + "/posttraining/create", this.surveyDataPostTraining, {headers: this.headers}).subscribe(
      success => {
        this.postTrainingRecordExistCheck = true;
        this.toastr.success("Post Training feedback submitted successfully.");
        this.postBtnDisabled = false;
      },
      failed => {
        this.postTrainingRecordExistCheck = false;
        this.toastr.error("Error occurred. Cannot submit now. Try again later.");
        this.postBtnDisabled = false;
      }
    )
  }

  updatePreTrainingCreate() {
    this.preBtnDisabled = true;
    this.http.post(this.protocol + this.server + ":" + this.serverPort + "/pretraining/findByEmail", this.surveyDataPreTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        if (Object(successFind).length > 0) {
          this.http.put(this.protocol + this.server + ":" + this.serverPort + "/pretraining/update/" + successFind[0]['id'], this.surveyDataPreTraining, {headers: this.headers}).subscribe(
            success => {
              this.toastr.success("Pre Training feedback updated successfully.");
              this.preTrainingRecordExistCheck = true;
              this.preBtnDisabled = false;
            },
            failed => {
              this.toastr.error("Error occurred. Cannot update now. Try again later.");
              this.preTrainingRecordExistCheck = false;
              this.preBtnDisabled = false;
            }
          );
        } else {
          this.preBtnDisabled = false;
          this.toastr.error("Record does not exist");
        }
      },
      failedFind => {
        this.toastr.error("Record does not exist");
        this.preBtnDisabled = false;
      }
    );
  }

  updatePostTrainingCreate() {
    this.postBtnDisabled = true;
    this.http.post(this.protocol + this.server + ":" + this.serverPort + "/posttraining/findByEmail", this.surveyDataPostTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        if (Object(successFind).length > 0) {
          this.http.put(this.protocol + this.server + ":" + this.serverPort + "/posttraining/update/" + successFind[0]['id'], this.surveyDataPostTraining, {headers: this.headers}).subscribe(
            success => {
              this.postTrainingRecordExistCheck = true;
              this.toastr.success("Post Training feedback updated successfully.");
              this.postBtnDisabled = false;
            },
            failed => {
              this.postTrainingRecordExistCheck = false;
              this.toastr.error("Error occurred. Cannot update now. Try again later.");
              this.postBtnDisabled = false;
            }
          );
        } else {
          this.toastr.error("Record does not exist");
          this.postBtnDisabled = false;
        }
      },
      failedFind => {
        this.toastr.error("Record does not exist");
        this.postBtnDisabled = false;
      }
    );
  }

  async preTrainingRecordExistFill() {
    await this.http.post(this.protocol + this.server + ":" + this.serverPort + "/pretraining/findByEmail", this.surveyDataPreTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        this.surveyDataPreTraining = Object(successFind).length > 0? successFind[0] : this.surveyDataPreTraining;
        this.preTrainingRecordExistCheck = Object(successFind).length > 0;
      }, failedFind => {
        this.preTrainingRecordExistCheck = false;
      }
    );
  }

  async postTrainingRecordExistFill() {
    await this.http.post(this.protocol + this.server + ":" + this.serverPort + "/posttraining/findByEmail", this.surveyDataPostTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        this.surveyDataPostTraining = Object(successFind).length > 0? successFind[0] : this.surveyDataPostTraining;
        this.postTrainingRecordExistCheck = Object(successFind).length > 0;
      }, failedFind => {
        this.postTrainingRecordExistCheck = false;
      }
    );
  }
}
