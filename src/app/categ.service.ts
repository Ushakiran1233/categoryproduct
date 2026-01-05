import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategService {

  constructor(private http:HttpClient) { }
  private geturl="https://localhost:7012/api/Product/GetProducts";
  private insurl="https://localhost:7012/api/Product/PostProduct";
  private checkprodcode="https://localhost:7012/api/Product/check-product-code";
  private getcat="https://localhost:7012/api/Product/Getcategories";
  private delurl="https://localhost:7012/api/Product/DeleteProduct";
  private updurl="https://localhost:7012/api/Product";
  // Method to create a product
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.insurl, product);
  }
  getproducts()
  {
    return this .http.get(this.geturl);
  }

  // Method to check if the product code is unique
  checkProductCodeUnique(productcode: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.checkprodcode}/${productcode}`);
  }
  getcategories()
  {
    return this.http.get(this.getcat);
  
  }
  Deleteproduct(id: any) {
    
    return this.http.delete(`${this.delurl}/${id}`)
    
    
  }
 
updateProduct(updatedproduct:any)
  {
    return this.http.put(`${this.updurl}`,updatedproduct);
  }
}
