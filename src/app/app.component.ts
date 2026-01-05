import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CategService } from './categ.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { __values } from 'tslib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'categoryproduct';
  productForm: FormGroup;
  product6: any[] = [];
  category1: any[] = [];
  errormessage: string = '';
  // selectedProductId: number | null = null;

  constructor(private fb: FormBuilder, private ds: CategService) {
    this.productForm = this.fb.group({
      productname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productprice: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      quantity: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      productcode: ['', [Validators.required]], 
      categoryid: ['', [Validators.required]],
      totalprice: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.getproducts();
    this.getcategories();
    this.productForm.valueChanges.subscribe(values=>{
      const price=values.productprice || 0;
      const quantity=values.quantity || 0;
      this.productForm.patchValue({totalprice:price*quantity},{emitEvent:false});
    })
  }

  getproducts() {
    return this.ds.getproducts().subscribe((data: any) => {
      this.product6 = data;
    });
  }

  getcategories() {
    return this.ds.getcategories().subscribe((data: any) => {
      this.category1 = data;
    });
  }
edit(product:any)
{
this.selectedProductId=product.productid;
this.productForm.patchValue(product);
}
  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      const productCode = product.productcode; // Ensure correct variable usage
  
      if (!productCode) {
        this.errormessage = 'Product Code is required';
        return;
      }
  
      // Check for unique ProductCode only if creating a new product
      if (!product.productid) { // If productid is not present, it's a new product
        this.ds.checkProductCodeUnique(productCode).subscribe(
          (isUnique: boolean) => {
            if (!isUnique) { // Prevent insertion if product code exists
              this.errormessage = 'Product Code already exists';
              Swal.fire('Error', 'Product Code already exists', 'error');
            } else {
              this.errormessage = '';
              this.ds.createProduct(product).subscribe(
                (response: any) => {
                  Swal.fire('Record inserted', 'Record inserted successfully', 'success');
                  this.getproducts();
                  this.productForm.reset(); // Reset form after successful submission
                },
                (error: any) => {
                  console.error('Error while creating product', error);
                }
              );
            }
          },
          (error) => {
            console.error('Error checking product code uniqueness', error);
          }
        );
      } else {
        const updatedproduct=this.productForm.value; 
        this.ds.updateProduct(updatedproduct).subscribe(
          (response: any) => {
            Swal.fire('Record updated', 'Record updated successfully', 'success');
            this.getproducts();
            this.productForm.reset(); // Reset form after successful update
          },
          (error: any) => {
            console.error('Error while updating product', error);
          }
        );
      }
    }
  }
  Delete(id:any)
  {
    if(confirm("Are you want to Delete"))
    {
 this.ds.Deleteproduct(id).subscribe((data:any)=>
{
  Swal.fire('Deleted Product','Deleted Product Sucessfully','success');
  // this.getproducts();
})
    }
}

}
