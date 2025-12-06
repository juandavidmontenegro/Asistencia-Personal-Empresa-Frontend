import { CommonModule } from '@angular/common';
import { AfterRenderRef, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../service/ingresos.service';
import { FormsModule } from '@angular/forms';
import { Ingreso, Salida, Usuario } from '../../interface/attentends.interface';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, FormsModule ,
  MatPaginatorModule, MatSortModule,
    MatTableModule, MatInputModule,
    MatFormFieldModule , MatIconModule],
  templateUrl: './tabla.component.html',
})
export class TablaComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['cedula', 'Nombre Completo', 'Fecha Entrada', 'Hora Entrada',
    'Fecha Salida', 'Hora Salida' , 'tipo de Salida' ,'fecha boleta'];
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>([]);
  loading = false;

  constructor( private dataService : DialogService){
    this.dataSource = new MatTableDataSource<Usuario>([]);
  }


  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Primero, agregar una función auxiliar para manejar las fechas
private formatearFecha(fecha: string | Date | null | undefined): string {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString() || '';
}

loadUsers(): void {
  this.loading = true;
  this.dataService.getUsers(1, 100).subscribe({
    next: (response) => {
      const usuarios = response.usuarios.map(usuario => {
        // Crear objeto base con valores por defecto
        const usuarioMapped = {
          ...usuario,
          fechaEntrada: this.formatearFecha(usuario.ingreso?.[0]?.fechaEntrada),
          horaEntrada: usuario.ingreso?.[0]?.horaEntrada || '',
          fechaSalida: '',
          horaSalida: '',
          tipoSalida: '',
          fechaboleta: ''
        };

        // Añadir información de salida solo si existe
        if (usuario.salidas && usuario.salidas.length > 0) {
          usuarioMapped.fechaSalida = this.formatearFecha(usuario.salidas[0].fechaSalida);
          usuarioMapped.horaSalida = usuario.salidas[0].horaSalida || '';
          usuarioMapped.tipoSalida = usuario.salidas[0].tipo_de_salida || '';
          usuarioMapped.fechaboleta = this.formatearFecha(usuario.salidas[0].fechaboleta);
        }

        return usuarioMapped;
      });

      // Procesar salidas adicionales
      const todosLosRegistros = [...usuarios];
      usuarios.forEach(usuario => {
        if (usuario.salidas?.length > 1) {
          usuario.salidas.slice(1).forEach((salida: Salida) => {
            todosLosRegistros.push({
              ...usuario,
              fechaSalida: this.formatearFecha(salida.fechaSalida),
              horaSalida: salida.horaSalida || '',
              tipoSalida: salida.tipo_de_salida || '',
              fechaboleta: this.formatearFecha(salida.fechaboleta)
            });
          });
        }
      });

      this.dataSource.data = todosLosRegistros;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al cargar usuarios:', error);
      this.loading = false;
    }
  });
}


  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  editAttendence(usuario: Usuario) {
    console.log('Editando usuario:', usuario);
  }

  deleteAttendence(usuario: Usuario) {
    console.log('Eliminando usuario:', usuario);
  }

}






