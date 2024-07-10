import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EmployeeService } from './employee.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [EmployeeService],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';

interface Employee {
    id: number | null;
    name: string;
    salary: string;
    age: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    employees: Employee[] = [];
    employee: Employee = { id: null, name: '', salary: '', age: '' };
    isEdit = false;

    constructor(private employeeService: EmployeeService) { }

    ngOnInit() {
        this.getEmployees();
    }

    getEmployees() {
        this.employeeService.getEmployees().subscribe((data: Employee[]) => {
            this.employees = data;
        });
    }

    getEmployee(id: number) {
        this.employeeService.getEmployee(id).subscribe((data: Employee) => {
            this.employee = data;
            this.isEdit = true;
        });
    }

    addEmployee() {
        this.employeeService.addEmployee(this.employee).subscribe((data: Employee) => {
            this.employees.push(data);
            this.employee = { id: null, name: '', salary: '', age: '' };
        });
    }

    updateEmployee() {
        this.employeeService.updateEmployee(this.employee).subscribe(() => {
            this.getEmployees();
            this.employee = { id: null, name: '', salary: '', age: '' };
            this.isEdit = false;
        });
    }

    deleteEmployee(id: number) {
        this.employeeService.deleteEmployee(id).subscribe(() => {
            this.getEmployees();
        });
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Employee {
    id: number;
    name: string;
    salary: string;
    age: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private baseUrl = 'https://dummyapi.io/data/api/employee';
    private headers = new HttpHeaders({ 'app-id': 'your-app-id-here' });

    constructor(private http: HttpClient) { }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.baseUrl, { headers: this.headers });
    }

    getEmployee(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.baseUrl}/${id}`, { headers: this.headers });
    }

    addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(this.baseUrl, employee, { headers: this.headers });
    }

    updateEmployee(employee: Employee): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${employee.id}`, employee, { headers: this.headers });
    }

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers });
    }
}
