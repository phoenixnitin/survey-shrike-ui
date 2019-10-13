import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import * as $ from "jquery";

@Component({
  selector: 'app-post-training',
  templateUrl: './post-training.component.html',
  styleUrls: ['./post-training.component.scss']
})
export class PostTrainingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    $('#form2').submit(function (e) {
      e.preventDefault();
    });
  }

  onsubmitPage2() {
    console.log('hello2');
    alert('submitted');
    $('#page-1').removeClass('hide');
    $('#page-2').addClass('hide');
    $('#form1').trigger('reset');
    $('#form2').trigger('reset');
  }
  goToPage1() {
    console.log('Back');
    this.router.navigate(['pre-training']);
  }

}
