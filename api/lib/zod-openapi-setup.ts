// Ce module étend Zod avec `.openapi()` (fourni par `@asteasolutions/zod-to-openapi`).
//
// ⚠️ Zod v4 copie les méthodes de `ZodType.prototype` sur chaque schéma au moment
// de sa création. Autrement dit : l'extension doit être appliquée AVANT que les
// fichiers de schémas (`*.schema.ts`) ne soient évalués, sinon les schémas
// existants n'auront pas la méthode `.openapi` et `OpenAPIRegistry.register`
// plantera avec `TypeError: zodSchema.openapi is not a function`.
//
// Pour garantir l'ordre, ce fichier doit être importé AVANT tout schéma Zod
// (par ex. en premier dans `openapi.ts`).
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);
