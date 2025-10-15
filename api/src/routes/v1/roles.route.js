import express from 'express';
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
} from '../../controllers/Roles.controller.js';
import validateToken from '../../middlewares/validate-token.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.route('/')
  .all(validateToken, authorize())
  .post(createRole)
  .get(getAllRoles);

router.route('/:role_id')
  .all(validateToken, authorize())
  .get(getRoleById)
  .put(updateRole)
  .delete(deleteRole);

export default router;
