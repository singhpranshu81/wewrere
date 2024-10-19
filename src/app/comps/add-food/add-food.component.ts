import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/entity/Food';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css'],
})
export class AddFoodComponent {
  foodModel: Food = {
    foodId: 0,
    foodName: '',
    description: '',
    price: 0,
    quantity: 0,
    url: '',
    category: {
      categoryId: 0,
      categoryName: '',
    },
    cart: {
      cartId: 0,
    },
  };

  categoryType: string = ''; // This will hold the value of the selected option

  nextId: number = 0;

  // Methods to check the current category selection
  isCreateNewCategory(): boolean {
     this.categoryService.getNextCategoryId().subscribe((data) => {
      this.nextId = data;
    }
    );
    this.foodModel.category.categoryId = this.nextId;

    return this.categoryType === 'new';
  }

  isSelectExistingCategory(): boolean {
     this.nextId=this.searchIDFromCategory(this.foodModel.category.categoryName);
     this.foodModel.category.categoryId = this.nextId;
    return this.categoryType === 'existing';
  }

  constructor(
    private foodService: FoodService,
    private categoryService: CategoryService,
    private router: Router
  ) {}
  category: any = [];
  ngOnInit(): void {
    this.categoryService.getAllCategory().subscribe((data) => {
      this.category = data;
    });
  }

  searchIDFromCategory(categoryName: string): number {  
    let categoryID = 0;
    for (let i = 0; i < this.category.length; i++) {
      if (this.category[i].categoryName === categoryName) {
        categoryID = this.category[i].categoryId;
        break;
      }
    }
    return categoryID;
  }

  onSubmit() {
    // this.findCategoryByName(this.foodModel.category.categoryName)
    this.foodService.createFood(this.foodModel).subscribe({
      next: (response) => {
        console.log('Food Created..', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error adding Food...', error);
      },
    });
  }
  findCategoryByName(categoryName: any): void {
    const foundCategory = this.category.find(
      (category: { categoryName: string }) =>
        category.categoryName === this.foodModel.category.categoryName
    );

    if (foundCategory) {
      console.log('Found Category:', foundCategory);
      // Perform any other actions with the found category
    } else {
      console.log('Category not found');
    }
  }
}
