import uniqolor from 'uniqolor';

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: uniqolor(name.toUpperCase(), { lightness: 40, saturation: 100 }).color,
    },
    children: `${name[0]}`,
  };
}
