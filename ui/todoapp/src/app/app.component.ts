import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todoapp';
  readonly APIUrl = "http://localhost:3000/";
  notes: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshNotes();
  }

  refreshNotes() {
    this.http.get(this.APIUrl + "GetNotes").subscribe((data: any) => {
      this.notes = data;
    });
  }

  addNotes() {
    const newNotes = (document.getElementById("newNotes") as HTMLInputElement).value;
    const formData = new FormData();
    formData.append("newNotes", newNotes);
    this.http.post(this.APIUrl + 'AddNotes', formData).subscribe((data: any) => {
      alert(data);
      this.refreshNotes();
    });
  }

  deleteNotes(id: any) {
    this.http.delete(this.APIUrl + 'DeleteNotes?id=' + id).subscribe((data: any) => {
      alert(data);
      this.refreshNotes();
    });
  }
}
