const main = async () => {
  await (await import('./000-admin')).default()
  await (await import('./001-user')).default()
}

main()
