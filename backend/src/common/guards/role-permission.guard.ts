// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { DataSource } from 'typeorm';
// import { BusinessUnitRolesMenu } from '../common/entities/business-unit-roles-menu.entity';
// import { PERMISSION_KEY, PermissionAction } from '../decorators/permission.decorator';

// @Injectable()
// export class RolePermissionGuard implements CanActivate {
//   constructor(
//     private readonly dataSource: DataSource,
//     private readonly reflector: Reflector,
//   ) {}

// async canActivate(context: ExecutionContext): Promise<boolean> {
//   const request = context.switchToHttp().getRequest();
//   const user = request.user;

//   if (!user || !user.currentRoleId) {
//     throw new ForbiddenException('Missing or invalid user role');
//   }

//   const requiredAction = this.reflector.get<PermissionAction>(
//     PERMISSION_KEY,
//     context.getHandler(),
//   );

//   if (!requiredAction) {
//     return true;
//   }

//   // Normalize controller name (remove "Controller")
//   const controllerName = context.getClass().name.replace(/Controller$/, '').trim();

//   // Load permissions + controller names
//   const allPermissions = await this.dataSource
//     .getRepository(BusinessUnitRolesMenu)
//     .createQueryBuilder('perm')
//     .leftJoinAndSelect('perm.Menu', 'menu')
//     .where('perm.BusinessUnitRolesId = :roleId', { roleId: user.currentRoleId })
//     // .andWhere('perm.IsVisible = :visible', { visible: true })
//     .getMany();

//   // Match controller name (from Menu.ControllerNames)
//   const permissionRecord = allPermissions.find((perm) => {
//     const names = perm.Menu?.ControllerNames;
//     if (!names) {
//       return false;
//     }

//     const list = names
//       .split(',')
//       .map((c) => c.trim().replace(/Controller$/, ''));

//     return list.includes(controllerName);
//   });

//   if (!permissionRecord) {
//     throw new ForbiddenException(`No permissions found for ${controllerName}`);
//   }

//   const hasAccess = this.hasPermission(permissionRecord, requiredAction);

//   if (!hasAccess) {
//     throw new ForbiddenException(
//       `Access denied: missing "${requiredAction}" permission`,
//     );
//   }

//   return true;
// }


//   private hasPermission(
//     record: BusinessUnitRolesMenu,
//     action: PermissionAction,
//   ): boolean {
//     const map = {
//       read: record.CanRead,
//       edit: record.CanEdit,
//       delete: record.CanDelete,
//       add: record.CanAdd,
//       print: record.CanPrint,
//     };

//     return !!map[action];
//   }
// }
