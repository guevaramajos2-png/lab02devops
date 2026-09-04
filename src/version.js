// Lógica de negocio trivial pero testeable: formatea la info de build del sitio.
function buildInfo(commitSha, date) {
  const shortSha = (commitSha || 'local').substring(0, 7);
  return {
    version: `1.0.0+${shortSha}`,
    builtAt: date || new Date().toISOString(),
    shortSha,
  };
}
module.exports = { buildInfo };
