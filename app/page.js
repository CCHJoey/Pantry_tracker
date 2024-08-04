'use client'
import '@fontsource/roboto';
import {Box, Button, Stack, Typography, Modal, TextField,Autocomplete} from '@mui/material';
import {collection, addDoc, getDoc, getDocs, querySnapshot, query, onSnapshot, deleteDoc, doc, setDoc, where} from "firebase/firestore"
import {firestore} from "./firebase"
import { useEffect, useState, useRef } from 'react';
import {Camera} from "react-camera-pro";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// const item = [
//   'computer',
//   'smart phone',
//   'watch',
//   'xbox',
//   'ps5',
//   'switch',
//   'playstation',
//   ''
// ]
export default function Home() {
  const [pantry, setPantry] = useState([])

  const [itemName, setItemName] = useState('')

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const camera = useRef(null);
  const [image, setImage] = useState('');

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const takePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
    }
  };

  useEffect(() => {
    updatePantry()
  }, [])

  // Add item to database
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    // Check if exist
    if(docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count+1})
    }else{
      await setDoc(docRef, {count: 1})
    }
    await updatePantry()
  }

  // Delete item from database
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {count} = docSnap.data()
      if(count === 1){
        await deleteDoc(docRef)
      }else{
        await setDoc(docRef, {count: count - 1})
      }
    }
    await updatePantry()
  }

  // Read item from database
  const updatePantry = async () => {
    let pantryList = []
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()})
    })
    setPantry(pantryList)
  }

  //Select item from database
//   const selectPantry = async (select) => {
//     if(!select){
//       console.log("Failed to fetch documents:", select);
//       return [];
//     }
//     console.log(select)
//     let pantryList = []
//     const snapshot = query(collection(firestore, 'pantry'), where("item", "==", select))
//     const docs = await getDocs(snapshot)
//     docs.forEach((doc) => {
//       pantryList.push({name: doc.id, ...doc.data()})
//     })
//     console.log(pantryList)
//     setPantry(pantryList)
// };
  const selectPantry = async (select) => {
    console.log(select)
    const docRef = doc(firestore, "pantry", select)
    const docSnap = await getDoc(docRef);
    console.log({ name: docSnap.id, ...docSnap.data() })
    setPantry([])
    setPantry([{ name: docSnap.id, ...docSnap.data() }])
  };

  return <Box width="100vw" 
  height="100vh" 
  display={"flex"} 
  justifyContent={"center"}
  alignItems={"center"}
  flexDirection={"column"}
  >
  {isCameraActive && <Camera ref={camera} />}
    <Button onClick={toggleCamera} variant="contained">
      {isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
    </Button>
    {isCameraActive && (
      <>
        <button onClick={() => setImage(camera.current.takePhoto())}>Take Photo</button>
        <img src={image} alt='Taken photo'/>
      </>
    )}
  <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={pantry}
      getOptionLabel={(option) => option.name} // Show only the name part
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      renderInput={(params) => <TextField {...params} label="Search" />}
      onChange={(event, newValue) => {
        if(!newValue){
          updatePantry()
          return
        }
        selectPantry(newValue.name);  // Pass the name property to the selectPantry function
    }}
    />
  <Button 
    variant="outlined" 
    onClick={handleOpen}
    sx={{
      ":hover": {bgcolor: "red"}
    }}
    >Add item</Button>
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add Item
      </Typography>
      <Stack width="100%" direction={"row"} spacing={2}>
        <TextField id="outlined-basic" label="Item" variant="outlined" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <Button onClick={() => {
          addItem(itemName)
          setItemName("")
          handleClose()
        }} variant="contained">Add</Button>
      </Stack>
    </Box>
  </Modal>
  <Box border={"1px solid #333"}>
  <Box width="800px" height="100px" bgcolor={"#00008b"}>
    <Typography
      variant={"h2"}
      color={"#ffff"}
      textAlign={"center"}
    >Pantry Tracker</Typography>
  </Box>
  <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
    {pantry.map(({name, count}) => (
      <Box
        key = {name}
        width="100%"
        height="100px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bgcolor={"#f0f0f0"}
      >
        <Typography
          variant={"h3"}
          color={"#333"}
          textAlign={"center"}
          fontWeight={"bold"}
        >
          {
            // Captitalize the first letter of the item
            name.charAt(0).toUpperCase() + name.slice(1)
          }
        </Typography>
        <Typography
        variant={"h3"}
        color={"#333"}
        textAlign={"center"}>
          {count}
        </Typography>
        <Button 
          variant='contained' 
          onClick={() => removeItem(name)}
          sx={{":hover": {bgcolor: "darkblue"}}}>X</Button>
      </Box>
    ))}
  </Stack>
  </Box>
  </Box>
}
