import { Component, Input, OnInit } from '@angular/core';
import { CategoriesType } from 'src/app/types/categories.type';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
 @Input() categories: CategoriesType[] = [];


  constructor() { }

  ngOnInit(): void {
  }

}
