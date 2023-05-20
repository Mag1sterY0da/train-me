import { Add, Clear, Search } from '@mui/icons-material';
import {
  Avatar,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getFriendsOfUserById,
  getNewFriendsById,
  subscribeToUser,
  unsubscribeFromUser,
} from '../api/client.ts';
import { useUser } from '../hooks/useUser.ts';
import { IUser } from '../interfaces/IUser.ts';

const FriendList = () => {
  const { user, refetchUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<IUser[] | null>(null);
  const [newFriends, setNewFriends] = useState<IUser[] | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      const friends = await getFriendsOfUserById(
        user._id ? user._id.toString() : ''
      );
      const newFriends = await getNewFriendsById(
        user._id ? user._id.toString() : ''
      );

      setFriends(friends.friends as IUser[]);
      setNewFriends(newFriends.friends as IUser[]);
    })();
  }, [user?._id, refetchUser]);

  const handleSearch = (values: { search: string }) => {
    setSearchQuery(values.search);
  };

  const filteredFriends =
    friends?.filter((friend) =>
      friend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const filteredNewFriends =
    newFriends?.filter((newFriend) =>
      newFriend.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const searchResults =
    filteredFriends.length > 0 || searchQuery === ''
      ? filteredFriends
      : filteredNewFriends;

  return (
    <Container>
      <Typography
        variant='h5'
        component='h2'
        align='center'
        gutterBottom
        sx={{ mb: '2.4rem' }}
      >
        Find your friends
      </Typography>
      <Formik initialValues={{ search: '' }} onSubmit={handleSearch}>
        <Form>
          <Field
            name='search'
            as={TextField}
            label='Search'
            variant='outlined'
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton type='submit' size='large'>
                  <Search />
                </IconButton>
              ),
            }}
            sx={{ marginBottom: 2 }}
          />
        </Form>
      </Formik>

      <Grid container spacing={2}>
        {searchResults?.map((friend) => (
          <Grid
            item
            key={friend._id?.toString()}
            xs={12}
            sm={6}
            md={4}
            width='100%'
          >
            <Grid container spacing={3} alignItems='center' width='100%'>
              <Grid item>
                <Avatar
                  alt={friend.nickname}
                  src={`data:image/png;base64, ${friend.avatar}`}
                />
              </Grid>
              <Grid item flexGrow={1}>
                <Link
                  to={`/users/${friend._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography>{friend.nickname}</Typography>
                </Link>
              </Grid>
              <Grid item>
                {/* If user is already subscribed to this friend, show 'clear' icon */}
                {/* Otherwise, show 'add' icon */}
                {friends?.some(
                  (friendOfUser) =>
                    friendOfUser._id?.toString() === friend._id?.toString()
                ) ? (
                  <IconButton
                    color='primary'
                    size='small'
                    onClick={async (event) => {
                      event.stopPropagation();
                      await unsubscribeFromUser(
                        user?._id ? user?._id.toString() : '',
                        friend._id ? friend._id.toString() : ''
                      );
                      refetchUser();
                    }}
                  >
                    <Clear />
                  </IconButton>
                ) : (
                  <IconButton
                    color='primary'
                    size='small'
                    onClick={async (
                      event: React.MouseEvent<HTMLButtonElement>
                    ) => {
                      event.stopPropagation();
                      await subscribeToUser(
                        user?._id ? user?._id.toString() : '',
                        friend._id ? friend._id.toString() : ''
                      );
                      refetchUser();
                    }}
                  >
                    <Add />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      {newFriends?.length !== 0 ? (
        <Typography
          variant='h5'
          component='h2'
          align='center'
          gutterBottom
          sx={{ my: '2.4rem' }}
        >
          Explore new friends
        </Typography>
      ) : null}

      <Grid container spacing={2}>
        {newFriends?.map((friend) => (
          <Grid
            item
            key={friend._id?.toString()}
            xs={12}
            sm={6}
            md={4}
            width='100%'
          >
            <Grid container spacing={3} alignItems='center' width='100%'>
              <Grid item>
                <Avatar
                  alt={friend.nickname}
                  src={`data:image/png;base64, ${friend.avatar}`}
                />
              </Grid>
              <Grid item flexGrow={1}>
                <Link
                  to={`/users/${friend._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography>{friend.nickname}</Typography>
                </Link>
              </Grid>
              <Grid item>
                <IconButton
                  color='primary'
                  size='small'
                  onClick={async (
                    event: React.MouseEvent<HTMLButtonElement>
                  ) => {
                    event.stopPropagation();
                    await subscribeToUser(
                      user?._id ? user?._id.toString() : '',
                      friend._id ? friend._id.toString() : ''
                    );
                    refetchUser();
                  }}
                >
                  <Add />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FriendList;
