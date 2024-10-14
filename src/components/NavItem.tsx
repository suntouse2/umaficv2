import { NavLink } from 'react-router-dom';

type NavItemProps = {
  type: 'button' | 'a' | 'link';
  onClick?: () => void;
  to?: string;
  href?: string;
  Icon?: React.FunctionComponent;
  title: string;
};

export default function NavItem({ Icon, title, onClick, type, to, href }: NavItemProps) {
  const classes = 'min-h-12 border-none outline-none no-underline text-sm flex px-4 py-2 gap-4 items-center hover:bg-softgray';

  return (
    <>
      {type == 'button' && (
        <button onClick={onClick} className={`w-full ${classes}`} type='button'>
          {Icon && <Icon />}
          <span className='block'>{title}</span>
        </button>
      )}
      {type == 'link' && (
        <NavLink to={to ?? '/'} className={({ isActive }) => `${isActive ? '[&>svg>path]:fill-secondaryHigh [&>svg>g>path]:fill-secondaryHigh' : ''} ${classes}`}>
          {Icon && <Icon />}
          <span className='block'>{title}</span>
        </NavLink>
      )}
      {type == 'a' && (
        <a className={`${classes}`} href={href} target='_blank'>
          {Icon && <Icon />}
          <span className='block'>{title}</span>
        </a>
      )}
    </>
  );
}
