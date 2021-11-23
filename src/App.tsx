import React, { useRef, useState } from "react";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles.css";
import InputText from "./Components/InputText";

export interface IData {
  id: number;
  userName: string;
  repositoryName: string;
  url: string;
}

const App: React.FC = () => {
  <ToastContainer />;
  const formRef = useRef<FormHandles>(null);
  const [userDataList, setUserDataList] = useState<IData[]>([]);

  function handleError(error: yup.ValidationError): void {
    error.inner.forEach((item) => {
      toast.error(item.message);
    });
  }

  function handleRemoveValues(id: number): void {
    setUserDataList((prevState) => {
      return prevState.filter((item) => item.id !== id);
    });
    toast.success("User has been removed");
  }

  async function handleSubmitValues(): Promise<void> {
    const schema = yup.object().shape({
      userName: yup.string().required("User name is required"),
      repositoryName: yup.string().required("Repository name is required"),
    });

    const userExists = userDataList.some(
      (item) =>
        item.userName === formRef.current?.getFieldValue("userName") &&
        item.repositoryName === formRef.current?.getFieldValue("repositoryName")
    );

    if (userExists) {
      toast.error("User already registered with the same repository");
      return;
    }
    try {
      const data = formRef.current?.getData();
      await schema.validate(data, { abortEarly: false });
      const user = formRef.current?.getFieldValue("userName");
      const repository = formRef.current?.getFieldValue("repositoryName");
      const response = await axios.get(`https://api.github.com/users/${user}`);
      const responseRepository = await axios.get(
        `https://api.github.com/users/${user}/repos`
      );
      const repositoryExists = responseRepository.data.some(
        (item: any) => item.name === repository
      );
      if (!repositoryExists) {
        toast.error("This user does not have this repository.");
        return;
      }
      const avatarUrl = response.data.avatar_url;
      setUserDataList((prevState) => {
        const newUser: IData = {
          id: Math.round(Math.random() * 100),
          userName: user,
          repositoryName: repository,
          url: avatarUrl,
        };

        const newList = [...prevState, newUser];
        return newList;
      });

      toast.success("User has been registered");
    } catch (error) {
      if (error instanceof yup.ValidationError) handleError(error);
    }
  }

  return (
    <div className="container">
      <div className="content">
        <ToastContainer pauseOnHover={false} />
        <h4>git hub activity</h4>
        <div className="form-box">
          <Form ref={formRef} onSubmit={handleSubmitValues}>
            <div className="inpt-box">
              <InputText name="userName" placeholder="User name" />
              <InputText name="repositoryName" placeholder="Repository name" />
              <button type="submit">Register</button>
            </div>
          </Form>
        </div>
        <div className="list-box">
          <ul>
            {userDataList.length === 0 && (
              <div className="noUserBox">
                <p>Nothing!!</p>
                <p>Your user list is empty</p>
              </div>
            )}
            {userDataList.map((item) => {
              return (
                <li>
                  <img src={item.url} alt="userphoto" />
                  <span>{item.userName}</span>
                  <span
                    onClick={() => {
                      console.log(
                        `https://api.github.com/repos/${item.userName}/${item.repositoryName}`
                      );
                    }}
                  >
                    {item.repositoryName}
                  </span>
                  <button
                    onClick={() => {
                      handleRemoveValues(item.id);
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
