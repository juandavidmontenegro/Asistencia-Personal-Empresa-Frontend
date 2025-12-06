import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RegisterPerson } from '../../interface/register.interface';
import { DialogService } from '../../service/ingresos.service';
import { Empleado, EmpleadosRegistrados } from '../../interface/empleados.interface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tabla2',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule , MatIcon],
  templateUrl: './tabla2.component.html'
})
export class Tabla2Component implements AfterViewInit  , OnInit{
  ngOnInit(): void {
    this.loadEmpleado();
  }

  displayedColumns: string[] = ['cedula', 'nombrecompleto', 'empresa', 'cargo', 'correo', 'jefeInmediato'];
  dataSource: MatTableDataSource<Empleado> = new MatTableDataSource<Empleado>([]);

  constructor( private readonly empleadosService : DialogService) {
    this.dataSource = new MatTableDataSource<Empleado>([]);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  loadEmpleado(): void {
    this.empleadosService.getTotales()
      .subscribe({
        next: (response) => {
          const usuarios = response.empleados.map(empleado => ({
            cedula: empleado.cedula,
            nombrecompleto: empleado.nombrecompleto,
            empresa: empleado.empresa,
            cargo: empleado.cargo,
            correo: empleado.correo,
            jejefeInmediato: empleado.jefeInmediato,
            id: empleado.id,
            jefeInmediato: empleado.jefeInmediato,
          }));
          this.dataSource.data = usuarios;
        },
        error: (error) => {
          console.error('Error al cargar los empleados', error);
        }
      });
  }

  deleteEmpleado( registro : Empleado){
    console.log('Eliminando', registro);
  }
  EditEmpleado( registro : Empleado){
  console.log('Editando', registro);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }






}
