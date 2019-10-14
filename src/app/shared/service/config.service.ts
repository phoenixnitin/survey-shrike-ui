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
  server = 'localhost';
  serverPort = '8080';
  preTrainingRecordExistCheck;
  postTrainingRecordExistCheck;
  headers = {
    'Access-Control-Allow-Origin': '*'
  };
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  preTrainingCreate() {
    this.http.post("http://" + this.server + ":" + this.serverPort + "/pretraining/create", this.surveyDataPreTraining, {headers: this.headers}).subscribe(
      success => {
        this.toastr.success("Pre Training feedback submitted successfully.");
      },
      failed => {
        this.toastr.error("Error occurred. Cannot submit now. Try again later.");
      }
    )
  }

  postTrainingCreate() {
    this.http.post("http://" + this.server + ":" + this.serverPort + "/posttraining/create", this.surveyDataPostTraining, {headers: this.headers}).subscribe(
      success => {
        this.toastr.success("Post Training feedback submitted successfully.");
      },
      failed => {
        this.toastr.error("Error occurred. Cannot submit now. Try again later.");
      }
    )
  }

  updatePreTrainingCreate() {
    this.http.post("http://" + this.server + ":" + this.serverPort + "/pretraining/findByEmail", this.surveyDataPreTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        if (Object(successFind).length > 0) {
          this.http.put("http://" + this.server + ":" + this.serverPort + "/pretraining/update/" + successFind[0]['id'], this.surveyDataPreTraining, {headers: this.headers}).subscribe(
            success => {
              this.toastr.success("Pre Training feedback updated successfully.");
              this.preTrainingRecordExistCheck = true;
            },
            failed => {
              this.toastr.error("Error occurred. Cannot update now. Try again later.");
              this.preTrainingRecordExistCheck = false;
            }
          );
        } else {
          this.toastr.error("Record does not exist");
        }
      },
      failedFind => {
        this.toastr.error("Record does not exist");
      }
    );
  }

  updatePostTrainingCreate() {
    this.http.post("http://" + this.server + ":" + this.serverPort + "/posttraining/findByEmail", this.surveyDataPostTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        if (Object(successFind).length > 0) {
          this.http.put("http://" + this.server + ":" + this.serverPort + "/posttraining/update/" + successFind[0]['id'], this.surveyDataPostTraining, {headers: this.headers}).subscribe(
            success => {
              this.postTrainingRecordExistCheck = true;
              this.toastr.success("Post Training feedback updated successfully.");
            },
            failed => {
              this.postTrainingRecordExistCheck = false;
              this.toastr.error("Error occurred. Cannot update now. Try again later.");
            }
          );
        } else {
          this.toastr.error("Record does not exist");
        }
      },
      failedFind => {
        this.toastr.error("Record does not exist");
      }
    );
  }

  async preTrainingRecordExistFill() {
    await this.http.post("http://" + this.server + ":" + this.serverPort + "/pretraining/findByEmail", this.surveyDataPreTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        this.surveyDataPreTraining = Object(successFind).length > 0? successFind[0] : this.surveyDataPreTraining;
        this.preTrainingRecordExistCheck = Object(successFind).length > 0;
      }, failedFind => {
        this.preTrainingRecordExistCheck = false;
      }
    );
  }

  async postTrainingRecordExistFill() {
    await this.http.post("http://" + this.server + ":" + this.serverPort + "/posttraining/findByEmail", this.surveyDataPostTraining.email, {headers: this.headers}).subscribe(
      successFind => {
        this.surveyDataPostTraining = Object(successFind).length > 0? successFind[0] : this.surveyDataPostTraining;
        this.postTrainingRecordExistCheck = Object(successFind).length > 0;
      }, failedFind => {
        this.postTrainingRecordExistCheck = false;
      }
    );
  }
}
