import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import * as $ from "jquery";
import {ConfigService} from "../shared/service/config.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-post-training',
  templateUrl: './post-training.component.html',
  styleUrls: ['./post-training.component.scss']
})
export class PostTrainingComponent implements OnInit {
  quality = {
    overpriced: false,
    highQuality: false,
    useful: false,
    ineffective: false,
    unique: false,
    poorQuality: false,
    goodValueForMoney: false
  };
  qualityMap = {
    overpriced: 'Overpriced',
    highQuality: 'High Quality',
    useful: 'Useful',
    ineffective: 'Ineffective',
    unique: 'Unique',
    poorQuality: 'Poor Quality',
    goodValueForMoney: 'Good value for money',
  };
  constructor(private router: Router, public config: ConfigService, private toastr: ToastrService) {
    this.config.postTrainingRecordExistFill();
  }

  ngOnInit() {
    $('#form2').submit(function (e) {
      e.preventDefault();
    });
  }
  onsubmitPage2() {
    let obj = this.config.surveyDataPostTraining;
    if (obj.name.trim().length > 0 && obj.training.trim().length > 0 && obj.satisfiedLevel.trim().length > 0
        && obj.attendBefore.trim().length > 0 && obj.attendReasonPost.trim().length > 0 && obj.recommend.trim().length > 0 && obj.comments.trim().length > 0 ) {
      if (this.config.postTrainingRecordExistCheck) {
        this.config.updatePostTrainingCreate();
      } else {
        this.config.postTrainingCreate();
      }
    } else {
      this.toastr.info("Please fill the required fields.");
    }

  }
  onCheckboxChange() {
    let q = "";
    for (let key in this.quality) {
      if (this.quality[key] == true) {
        q += this.qualityMap[key] + ','
      }
    }
    if (q.length > 0) {
      q = q.substring(0, q.length - 1)
    }
    this.config.surveyDataPostTraining.quality = q;
  }

}
