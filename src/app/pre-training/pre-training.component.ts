import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { ToastrService } from 'ngx-toastr';
import {ConfigService} from "../shared/service/config.service";
import {Router} from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pre-training',
  templateUrl: './pre-training.component.html',
  styleUrls: ['./pre-training.component.scss']
})
export class PreTrainingComponent implements OnInit {
  form: FormGroup;
  constructor(public config: ConfigService, private router: Router, private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.config.preTrainingRecordExistFill();
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      attend: [null, Validators.required]
    });
    $('#form1').submit(function (e) {
      e.preventDefault();
    });
  }
  onsubmitPage1() {
    let obj = this.config.surveyDataPreTraining;
    if (obj.eventReason.trim().length > 0 && obj.topic.trim().length > 0) {
      if (this.config.preTrainingRecordExistCheck) {
        this.config.updatePreTrainingCreate();
      } else {
        this.config.preTrainingCreate();
      }
    } else {
      this.toastr.info("Please fill required fields.")
    }
    // this.router.navigate(['post-training']);
  }
}
